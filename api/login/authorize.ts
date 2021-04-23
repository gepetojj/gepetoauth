import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { firestore } from "../../assets/firebase";
import { AppInfo, User, Code } from "../../assets/types";
import { validateAppInfo } from "../../assets/middlewares";
import { createRefreshToken } from "../../assets/tokens";
import { data, clientId, redirectUrl, state } from "../../assets/validators";
import response from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	data: data,
	client_id: clientId,
	redirect_uri: redirectUrl,
	state: state,
};
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

async function getAppInfo(clientId: string): Promise<AppInfo | false> {
	try {
		const appQuery = await firestore.collection("apps").doc(clientId).get();
		const data = appQuery.data();
		if (data !== undefined) {
			const isAppValid: boolean = data.isAppValid;
			if (isAppValid) {
				const appInfo: AppInfo = {
					app: data.app,
					author: data.author,
					clientId: data.clientId,
					isAppValid: isAppValid,
					redirectUrls: data.redirectUrls,
					authorizedDomains: data.authorizedDomains,
				};
				return appInfo;
			}
			return false;
		}
		return false;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

async function checkUsernameAndGetInfo(
	username: string
): Promise<[boolean, User?]> {
	try {
		const userQuery = await firestore
			.collection("users")
			.where("username", "==", username)
			.get();

		if (userQuery.empty) {
			return [false];
		}
		const userDoc = userQuery.docs[0];
		if (!userDoc.exists) {
			return [false];
		}
		const userData = userDoc.data();
		const user: User = {
			id: userData.id,
			username: userData.username,
			email: userData.email,
			password: userData.password,
			avatar: userData.avatar,
			level: userData.level,
			state: userData.state,
			register: userData.register,
			apps: userData.apps,
		};
		return [true, user];
	} catch (err) {
		logger.error(err);
		return [false];
	}
}

async function checkPasswords(
	password: string,
	hash: string
): Promise<boolean> {
	const match = await bcrypt.compare(password, hash);
	return match;
}

async function registerNewCode(codeObj: Code): Promise<boolean> {
	try {
		const codeVerification = await firestore
			.collection("codes")
			.doc(codeObj.code)
			.get();
		if (!codeVerification.exists) {
			await firestore
				.collection("codes")
				.doc(codeObj.code)
				.create(codeObj);
			return true;
		}
		return false;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

router.get(
	"/",
	checkSchema(schema),
	validateAppInfo({ redirectUrlRequired: true }),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(
					response(true, "invaliddata", { errors: errors.array() })
				);
		}

		let { data, client_id, redirect_uri, state } = req.query;
		data = String(data);
		client_id = String(client_id);
		redirect_uri = decodeURI(String(redirect_uri));
		state = String(state);

		const decodedData = JSON.parse(
			Buffer.from(data, "hex").toString("utf8")
		);

		const username = decodedData.u;
		const password = decodedData.p;

		const appInfo = await getAppInfo(client_id);
		if (appInfo === false) {
			return res.status(500).json(response(true, "databaseerror"));
		}

		const usernameCheck = await checkUsernameAndGetInfo(username);
		if (!usernameCheck[0]) {
			return res.status(400).json(response(true, "invalidusername"));
		}

		if (usernameCheck[1] !== undefined) {
			const userData = usernameCheck[1];
			const passwordCheck = await checkPasswords(
				password,
				userData.password
			);
			if (!passwordCheck) {
				return res.status(400).json(response(true, "invalidpassword"));
			}
			if (userData.state.banned.is) {
				return res.status(401).json(
					response(true, "userbanned", {
						reason: userData.state.banned.reason,
					})
				);
			}
			if (!userData.state.emailConfirmed) {
				return res
					.status(401)
					.json(response(true, "emailnotconfirmed"));
			}
		}

		const code = createRefreshToken();
		const validUntil = dayjs().add(1, "hour").valueOf();
		const codeObj: Code = {
			code,
			validUntil,
			origin: req.hostname,
			user:
				usernameCheck[1] === undefined
					? {
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
					  }
					: usernameCheck[1],
		};
		const insertCode = await registerNewCode(codeObj);
		if (!insertCode) {
			return res.status(500).json(response(true, "databaseerror"));
		}

		const finalRedirect = `${redirect_uri}?code=${code}&state=${state}`;

		return res.render("confirm", {
			style: `/static/confirm.css`,
			username: username,
			appName: appInfo.app.name,
			appDescription: appInfo.app.description,
			appAvatar: appInfo.app.avatar,
			appRedirect: redirect_uri,
			redirectUrl: finalRedirect,
		});
	}
);

export default router;
