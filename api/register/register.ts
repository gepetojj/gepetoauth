import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { firestore } from "../../assets/firebase";
import { createId } from "../../assets/tokens";
import { username, password, email } from "../../assets/validators";
import { User } from "../../assets/types";
import response from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	username: username,
	email: email,
	password: password,
	passwordConfirmation: password,
};
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

interface RequiredData {
	username: string;
	email: string;
	password: string;
	passwordConfirmation: string;
}

async function verifyUsernameAndEmail(
	username: string,
	email: string
): Promise<boolean> {
	try {
		const db = firestore.collection("users");
		const userQuery = await db.where("username", "==", username).get();
		if (!userQuery.empty) return false;
		const emailQuery = await db.where("email", "==", email).get();
		if (!emailQuery.empty) return false;
		return true;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

async function insertUser(user: User): Promise<boolean> {
	try {
		await firestore.collection("users").doc(user.id).create(user);
		return true;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

router.post("/", checkSchema(schema), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(
			response(true, "invaliddata", {
				errors: errors.array(),
			})
		);
	}

	const {
		username,
		email,
		password,
		passwordConfirmation,
	}: RequiredData = req.body;

	if (password !== passwordConfirmation) {
		return res.status(400).json(response(true, "passwordequals"));
	}

	const verification = await verifyUsernameAndEmail(username, email);
	if (!verification) {
		return res.status(400).json(response(true, "useroremailexists"));
	}

	const passwordHash = await bcrypt.hash(password, 12);

	const id = createId();
	const agent = `${req.useragent?.browser} ${req.useragent?.version} ${req.useragent?.os} ${req.useragent?.platform} ${req.useragent?.source}`;
	const ip = req.clientIp;

	const user: User = {
		id,
		username,
		email,
		password: passwordHash,
		avatar: "https://firebasestorage.googleapis.com/v0/b/gepetoservices.appspot.com/o/user_image.png?alt=media&token=be333301-d240-47cf-9105-831881fe10ba",
		level: 0,
		state: {
			banned: {
				is: false,
				reason: "",
				date: 0,
			},
			emailConfirmed: true,
		},
		register: {
			date: dayjs().valueOf(),
			agent,
			ip: ip || "",
		},
		apps: [],
	};

	const newUser = await insertUser(user);
	if (!newUser) {
		return res.status(500).json(
			response(true, "databaseerror", {
				errors: errors.array(),
			})
		);
	}

	return res.json(response(false, "usercreated"));
});

export default router;
