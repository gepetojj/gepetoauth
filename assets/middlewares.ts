import { Request, Response, NextFunction } from "express";
import requestIp from "request-ip";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { HstsOptions, ClientId } from "./types";
import { firestore } from "./firebase";
import { verifyAccessToken } from "./tokens";
import logger from "./logger";
import response from "./response";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

export function hsts(options: HstsOptions) {
	const DEFAULT_MAX_AGE = 180 * 24 * 60 * 60;

	const maxAge = options.maxAge ? options.maxAge : DEFAULT_MAX_AGE;
	const includeSubDomains = options.includeSubDomains
		? options.includeSubDomains
		: false;
	const preload = options.preload ? options.preload : false;
	const setIf = options.setIf
		? options.setIf
		: () => {
				return true;
		  };

	if (maxAge < 0) {
		throw new RangeError("HSTS maxAge must be nonnegative.");
	}

	let header = "max-age=" + Math.round(maxAge);
	if (includeSubDomains) {
		header += "; includeSubDomains";
	}
	if (preload) {
		header += "; preload";
	}

	return function hsts(req: Request, res: Response, next: NextFunction) {
		if (setIf(req, res)) {
			res.setHeader("Strict-Transport-Security", header);
		}

		next();
	};
}

export function userIp() {
	return function userIp(req: Request, res: Response, next: NextFunction) {
		let userIp = requestIp.getClientIp(req);
		let ip: string | undefined = "";
		if (userIp === null) {
			ip = undefined;
		}
		req.clientIp = ip;
		next();
	};
}

export function validateAppInfo({
	redirectUrlRequired,
}: {
	redirectUrlRequired: boolean;
}) {
	return async function validateAppInfo(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		let { client_id, redirect_uri } = req.query;
		client_id = String(client_id);
		redirect_uri = decodeURI(String(redirect_uri));
		const origin = req.hostname;

		if (!client_id) {
			return res.status(401).json(response(true, "invalidclientid"));
		}

		if (!ClientId.test(client_id)) {
			return res.status(400).json(response(true, "clientidlength"));
		}

		try {
			const appQuery = await firestore
				.collection("apps")
				.doc(client_id)
				.get();
			if (!appQuery.exists) {
				return res.status(401).json(response(true, "invalidclientid"));
			}
			const appData = appQuery.data();
			if (appData === undefined) {
				return res.status(401).json(response(true, "invalidclientid"));
			}

			if (!appData.isAppValid) {
				return res.status(401).json(response(true, "invalidclientid"));
			}

			const validDomains = appData.authorizedDomains;
			const isOriginValid = validDomains.includes(origin);
			if (!isOriginValid) {
				return res.status(401).json(response(true, "invalidorigin"));
			}

			const validRedirectUrls = appData.redirectUrls;
			if (redirectUrlRequired && redirect_uri === undefined) {
				return res
					.status(401)
					.json(response(true, "invalidredirecturl"));
			}
			if (redirectUrlRequired && redirect_uri !== undefined) {
				if (!validRedirectUrls.includes(redirect_uri)) {
					return res
						.status(401)
						.json(response(true, "invalidredirecturl"));
				}
			}
			if (req.session !== undefined && req.session !== null) {
				req.session.appdata = appData;
			}
			return next();
		} catch (err) {
			logger.error(err);
			return res.status(500).json(response(true, "databaseerror"));
		}
	};
}

export function validateSession({ level }: { level: number }) {
	return async function validateAppInfo(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const token =
			req.session === undefined || req.session === null
				? ""
				: String(req.session.accessToken);

		if (token === "null") {
			if (req.session !== undefined && req.session !== null) {
				req.session.accessToken = null;
			}
			return res.status(401).json(response(true, "invalidatoken"));
		}

		const { valid, payload } = verifyAccessToken(token);
		if (valid && payload !== undefined) {
			if (payload.payload.level < level) {
				return res.status(401).json(response(true, "invalidatoken"));
			}
			if (payload.validUntil) {
				const now = dayjs().valueOf();
				if (now > payload.validUntil) {
					if (req.session !== undefined && req.session !== null) {
						req.session.accessToken = null;
					}
					return res
						.status(401)
						.json(response(true, "expiredatoken"));
				}
			}
			const userQuery = await firestore
				.collection("users")
				.doc(payload.payload.id)
				.get();
			if (!userQuery.exists) {
				return res.status(400).json(response(true, "invalidusername"));
			}
			const userData = userQuery.data();
			if (userData !== undefined && userData.state.banned.is) {
				return res.status(401).json(response(true, "userbanned"));
			}
			if (req.session !== undefined && req.session !== null) {
				req.session.user = payload.payload;
			}
			return next();
		}
		return res.status(401).json(response(true, "invalidatoken"));
	};
}
