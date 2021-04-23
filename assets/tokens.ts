require("dotenv").config();
import jws from "jws";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { AccessToken } from "./types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";

export function createId(): string {
	const base = "1234567890";
	let output = "";
	const baseLength = base.length;
	for (let count = 0; count < 14; count++) {
		output += base.charAt(Math.floor(Math.random() * baseLength));
	}
	return output;
}

export function createAccessToken(
	payload: AccessToken["payload"],
	app: string
): string {
	const tokenPayload: AccessToken = {
		tokenId: createId(),
		validUntil: dayjs().add(15, "minutes").valueOf(),
		app,
		payload,
	};
	const signature = jws.sign({
		header: { alg: "HS256" },
		payload: tokenPayload,
		secret: accessTokenSecret,
		encoding: "utf8",
	});
	return signature;
}

export function verifyAccessToken(
	accessToken: string
): { valid: boolean; payload?: AccessToken } {
	const isValid = jws.verify(accessToken, "HS256", accessTokenSecret);
	if (isValid) {
		const accessTokenPayload = JSON.parse(jws.decode(accessToken).payload);
		const accessTokenFormatted: AccessToken = {
			tokenId: accessTokenPayload.tokenId,
			validUntil: accessTokenPayload.validUntil,
			app: accessTokenPayload.app,
			payload: accessTokenPayload.payload,
		};
		const now = dayjs().valueOf();
		if (now > accessTokenPayload.validUntil) {
			return { valid: false };
		}
		return { valid: true, payload: accessTokenFormatted };
	}
	return { valid: false };
}

export function createRefreshToken(): string {
	const base =
		"12345678901234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let output = "";
	const baseLength = base.length;
	for (let count = 0; count < 32; count++) {
		output += base.charAt(Math.floor(Math.random() * baseLength));
	}
	return output;
}
