import jws from "jws";

import config from "../config";
import { DayjsLoader } from "../loaders/DayjsLoader";

const dayjs = new DayjsLoader().execute();

export interface AccessToken {
	id: string;
	validUntil: number;
	payload: {
		username: string;
		email: string;
		avatar: string;
		level: number;
		registerDate: number;
		state: {
			banned: { is: boolean; reason?: string; date?: number };
			emailConfirmed: boolean;
		};
	};
}

export function createId(): string {
	const base = "1234567890";
	let output = "";
	const baseLength = base.length;
	for (let count = 0; count < 14; count++) {
		output += base.charAt(Math.floor(Math.random() * baseLength));
	}
	return output;
}

export function createAccessToken(payload: AccessToken["payload"]): string {
	const tokenPayload: AccessToken = {
		id: createId(),
		validUntil: dayjs().add(15, "minutes").valueOf(),
		payload,
	};
	const signature = jws.sign({
		header: { alg: "HS256" },
		payload: tokenPayload,
		secret: config.accessTokenSecret,
		encoding: "utf8",
	});
	return signature;
}

export function verifyAccessToken(
	accessToken: string
): { valid: boolean; payload?: AccessToken } {
	const isValid = jws.verify(accessToken, "HS256", config.accessTokenSecret);
	if (isValid) {
		const accessTokenPayload = JSON.parse(jws.decode(accessToken).payload);
		const accessTokenFormatted: AccessToken = {
			id: accessTokenPayload.id,
			validUntil: accessTokenPayload.validUntil,
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
