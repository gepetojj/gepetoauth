import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { firestore } from "../../assets/firebase";
import { Code, RefreshToken } from "../../assets/types";
import { validateAppInfo } from "../../assets/middlewares";
import { createRefreshToken, createAccessToken } from "../../assets/tokens";
import { clientId, code } from "../../assets/validators";
import response from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	code: code,
	client_id: clientId,
};
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

async function verifyCodeAndGetInfo(code: string): Promise<[boolean, Code?]> {
	try {
		const codeQuery = await firestore.collection("codes").doc(code).get();
		if (!codeQuery.exists) {
			return [false];
		}
		const codeData = codeQuery.data() || {};
		const data: Code = {
			code: codeData.code,
			validUntil: codeData.validUntil,
			origin: codeData.origin,
			user: codeData.user,
		};
		return [true, data];
	} catch (err) {
		logger.error(err);
		return [false];
	}
}

async function addSessionData(
	refreshToken: string,
	userId: string,
	app: string
): Promise<boolean> {
	try {
		const tokenData: RefreshToken = {
			createdAt: dayjs().valueOf(),
			validUntil: dayjs().add(7, "days").valueOf(),
			app,
			userId: userId,
		};
		await firestore
			.collection("sessions")
			.doc(refreshToken)
			.create(tokenData);
		return true;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

async function deleteCode(code: string) {
	try {
		await firestore.collection("codes").doc(code).delete();
		return true;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

router.get(
	"/",
	checkSchema(schema),
	validateAppInfo({ redirectUrlRequired: false }),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(
					response(true, "invaliddata", { errors: errors.array() })
				);
		}

		let { code } = req.query;
		const origin = req.hostname;
		code = code?.toString() || "";

		const codeVerification = await verifyCodeAndGetInfo(code);
		if (!codeVerification[0]) {
			return res.status(400).json(response(true, "invalidcode"));
		}
		let codeData: Code = {
			code: "",
			validUntil: 0,
			origin: "",
			user: {
				id: "",
				username: "",
				email: "",
				password: "",
				avatar: "",
				level: 0,
				state: {
					banned: { is: false },
					emailConfirmed: true,
				},
				register: {
					date: 0,
					agent: "",
					ip: "",
				},
				apps: [],
			},
		};
		if (codeVerification[1] !== undefined) {
			codeData = codeVerification[1];
		}

		const now = dayjs().valueOf();

		if (now > codeData.validUntil) {
			return res.status(401).json(response(true, "expiredcode"));
		}

		if (origin !== codeData.origin) {
			return res.status(401).json(response(true, "invalidorigin"));
		}

		const appId =
			req.session === undefined || req.session === null
				? ""
				: String(req.session.appdata.id);

		const refreshToken = createRefreshToken();
		const accessToken = createAccessToken(
			{
				id: codeData.user.id,
				name: codeData.user.username,
				email: codeData.user.email,
				level: codeData.user.level,
				avatar: codeData.user.avatar,
				registerDate: codeData.user.register.date,
				apps: codeData.user.apps,
			},
			appId
		);
		const sessionData = await addSessionData(
			refreshToken,
			codeData.user.id,
			appId
		);
		if (!sessionData) {
			return res.status(500).json(response(true, "databaseerror"));
		}
		const codeDelete = await deleteCode(codeData.code);
		if (!codeDelete) {
			return res.status(500).json(response(true, "databaseerror"));
		}

		if (req.session !== undefined && req.session !== null) {
			req.session.refreshToken = refreshToken;
			req.session.accessToken = accessToken;
		}
		return res.json(
			response(false, "authorized", {
				accessToken,
				refreshToken,
			})
		);
	}
);

export default router;
