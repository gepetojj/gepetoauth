import validator from "validator";
import { messages } from "./response";

export interface ValidatorResponse {
	error: boolean;
	message?: string;
	value?: string;
}

export function validateUsername(username: any): ValidatorResponse {
	if (!username) {
		return { error: true, message: messages.invalidusername };
	}

	if (validator.isEmpty(username)) {
		return { error: true, message: messages.invalidusername };
	}
	if (!validator.isLength(username, { min: 3, max: 15 })) {
		return { error: true, message: messages.usernamelength };
	}

	const sanitizedUsername = validator.escape(username);
	return { error: false, value: sanitizedUsername };
}

export function validateEmail(email: any): ValidatorResponse {
	if (!email) {
		return { error: true, message: messages.invalidemail };
	}

	if (validator.isEmpty(email)) {
		return { error: true, message: messages.invalidemail };
	}
	if (!validator.isEmail(email)) {
		return { error: true, message: messages.invalidemail };
	}
	const sanitizedEmail = validator.normalizeEmail(email) || email;
	return { error: false, value: sanitizedEmail };
}

export function validatePassword(password: any): ValidatorResponse {
	if (!password) {
		return { error: true, message: messages.invalidpassword };
	}

	if (validator.isEmpty(password)) {
		return { error: true, message: messages.invalidpassword };
	}
	if (!validator.isLength(password, { min: 8, max: 24 })) {
		return { error: true, message: messages.passwordlength };
	}
	if (!validator.isStrongPassword(password, { minLength: 8 })) {
		return { error: true, message: messages.passwordrequires };
	}
	return { error: false, value: password };
}

export function validateAccessToken(accessToken: any): ValidatorResponse {
	if (!accessToken) {
		return { error: true, message: messages.invalidatoken };
	}

	let accessTokenSanitized = validator.trim(accessToken);

	if (validator.isEmpty(accessTokenSanitized)) {
		return { error: true, message: messages.invalidatoken };
	}
	if (!validator.isJWT(accessTokenSanitized)) {
		return { error: true, message: messages.invalidatoken };
	}
	return { error: false, value: accessTokenSanitized };
}

export function validateRefreshToken(refreshToken: any): ValidatorResponse {
	if (!refreshToken) {
		return { error: true, message: messages.invalidrtoken };
	}

	let refreshTokenSanitized = validator.trim(refreshToken);
	refreshTokenSanitized = validator.escape(refreshTokenSanitized);

	if (validator.isEmpty(refreshTokenSanitized)) {
		return { error: true, message: messages.invalidrtoken };
	}
	if (!validator.isLength(refreshTokenSanitized, { min: 32, max: 32 })) {
		return { error: true, message: messages.rtokenlength };
	}
	return { error: false, value: refreshTokenSanitized };
}
