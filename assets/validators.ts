import { ParamSchema } from "express-validator";

import { messages } from "./response";

export const username: ParamSchema = {
	in: ["body"],
	errorMessage: messages.invalidusername,
	isString: true,
	toLowerCase: true,
	isLowercase: true,
	escape: true,
	isLength: {
		errorMessage: messages.usernamelength,
		options: {
			min: 3,
			max: 15,
		},
	},
};

export const password: ParamSchema = {
	in: ["body"],
	errorMessage: messages.invalidpassword,
	isString: true,
	isStrongPassword: {
		errorMessage: messages.passwordrequires,
		options: {
			minLength: 8,
			minLowercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			minUppercase: 1,
		},
	},
	isLength: {
		errorMessage: messages.passwordlength,
		options: {
			min: 8,
			max: 24,
		},
	},
};

export const email: ParamSchema = {
	in: ["body"],
	errorMessage: "O campo 'email' está inválido.",
	isString: true,
	toLowerCase: true,
	isLowercase: true,
	escape: true,
	isEmail: {
		errorMessage: "O campo 'email' deve ser um email válido.",
	},
};

export const data: ParamSchema = {
	in: ["query"],
	errorMessage: "O campo 'data' está inválido.",
	isString: true,
	escape: true,
	isLength: {
		errorMessage: "O campo 'data' deve ter pelo menos 10 caracteres.",
		options: {
			min: 10,
		},
	},
};

export const clientId: ParamSchema = {
	in: ["query"],
	errorMessage: messages.invalidclientid,
	isString: true,
	escape: true,
	isLength: {
		errorMessage: messages.clientidlength,
		options: {
			min: 14,
			max: 14,
		},
	},
};

export const redirectUrl: ParamSchema = {
	in: ["query"],
	errorMessage: messages.invalidredirecturl,
	isString: true,
	isLength: {
		errorMessage: messages.redirecturllength,
		options: {
			min: 3,
		},
	},
};

export const state: ParamSchema = {
	in: ["query"],
	errorMessage: "O campo 'state' está inválido.", // MUDAR
	isString: true,
	isLength: {
		errorMessage: "O campo 'state' deve ter entre 10 e 16 caracteres", // MUDAR
		options: {
			min: 10,
			max: 16,
		},
	},
};

export const code: ParamSchema = {
	in: ["query"],
	errorMessage: messages.invalidcode,
	isString: true,
	escape: true,
	isLength: {
		errorMessage: messages.codelength,
		options: {
			min: 32,
			max: 32,
		},
	},
};

export const refreshToken: ParamSchema = {
	in: ["query"],
	errorMessage: messages.invalidrtoken,
	isString: true,
	escape: true,
	isLength: {
		errorMessage: messages.rtokenlength,
		options: {
			min: 32,
		},
	},
};

export const accessToken: ParamSchema = {
	in: ["query"],
	errorMessage: messages.invalidatoken,
	isString: true,
	escape: true,
	isLength: {
		errorMessage: messages.atokenlength,
		options: {
			min: 32,
		},
	},
};
