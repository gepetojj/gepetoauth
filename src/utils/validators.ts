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

export function validateCode(code: any): ValidatorResponse {
	if (!code) {
		return { error: true, message: messages.invalidcode };
	}

	let codeSanitized = validator.trim(code);
	codeSanitized = validator.escape(codeSanitized);
	if (validator.isEmpty(codeSanitized)) {
		return { error: true, message: messages.invalidcode };
	}
	if (!validator.isLength(codeSanitized, { min: 32, max: 32 })) {
		return { error: true, message: messages.codelength };
	}
	return { error: false, value: codeSanitized };
}
