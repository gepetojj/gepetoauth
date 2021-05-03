import validator from "validator";

import { messages } from "./response";
import { ValidatorResponse } from "../../../utils/validators";

export function validateService(service: any): ValidatorResponse {
	if (!service) {
		return { error: true, message: messages.invalidservice };
	}

	if (validator.isEmpty(service)) {
		return { error: true, message: messages.invalidservice };
	}
	if (!validator.isLength(service, { min: 3, max: 15 })) {
		return { error: true, message: messages.invalidservice };
	}

	const sanitizedService = validator.escape(service);
	return { error: false, value: sanitizedService };
}

export function validateIcon(icon: any): ValidatorResponse {
	if (!icon) {
		return { error: true, message: messages.invalidicon };
	}

	if (validator.isEmpty(icon)) {
		return { error: true, message: messages.invalidicon };
	}
	if (!validator.isLength(icon, { min: 2, max: 20 })) {
		return { error: true, message: messages.invalidicon };
	}

	const sanitizedIcon = validator.escape(icon);
	return { error: false, value: sanitizedIcon };
}

export function validatePassword(password: any): ValidatorResponse {
	if (!password) {
		return { error: true, message: messages.invalidpassword };
	}

	if (validator.isEmpty(password)) {
		return { error: true, message: messages.invalidpassword };
	}
	if (!validator.isLength(password, { min: 5, max: 32 })) {
		return { error: true, message: messages.invalidpassword };
	}

	const sanitizedPassword = validator.escape(password);
	return { error: false, value: sanitizedPassword };
}
