import { Request, Response } from "express";

export interface HstsOptions {
	maxAge?: number;
	includeSubDomains?: boolean;
	preload?: boolean;
	setIf?: (req: Request, res: Response) => boolean;
}

export interface GAResponse {
	error: [boolean, string?];
	message: string;
	extra?: object;
}

export const ClientId: RegExp = /^\d\d\d\d\d\d\d\d\d\d\d\d\d\d$/;

export interface AppInfo {
	app: {
		avatar: string;
		description: string;
		name: string;
	};
	author: {
		avatar: string;
		name: string;
		support: string;
	};
	clientId: string;
	isAppValid: boolean;
	redirectUrls: string[];
	authorizedDomains: string[];
}

export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
	avatar: string;
	level: number;
	state: {
		banned: { is: boolean; reason?: string; date?: number };
		emailConfirmed: boolean;
	};
	register: {
		date: number;
		agent: string;
		ip: string;
	};
	apps: string[];
}

export interface Password {
	id: string;
	owner: {
		id: string;
		username: string;
	};
	service: string;
	username: string;
	password: {
		hash: string;
		iv: string;
		key: string;
	};
	creation: {
		date: number;
		agent: string;
		ip: string;
	};
}

export interface Code {
	code: string;
	validUntil: number;
	origin: string;
	user: User;
}

export interface RefreshToken {
	createdAt: number;
	validUntil: number;
	app: string;
	userId: string;
}

export interface AccessToken {
	tokenId: string;
	validUntil: number;
	app: string;
	payload: {
		id: string;
		name: string;
		email: string;
		level: number;
		avatar: string;
		registerDate: number;
		apps: string[];
	};
}

export interface Codes {
	// DATA VALIDATION
	invaliddata: string;
	invalidusername: string;
	usernamelength: string;
	invalidpassword: string;
	passwordlength: string;
	passwordrequires: string;
	passwordequals: string;
	invalidemail: string;
	useroremailexists: string;

	invalidclientid: string;
	clientidlength: string;

	invalidredirecturl: string;
	redirecturllength: string;

	invalidrtoken: string;
	expiredrtoken: string;
	rtokenlength: string;

	invalidatoken: string;
	expiredatoken: string;
	atokenlength: string;

	invalidcode: string;
	expiredcode: string;
	codelength: string;

	invalidorigin: string;

	invalidstate: string;

	// USER STATE
	emailnotconfirmed: string;
	userbanned: string;

	// SUCCESS
	tokenrevoked: string;
	authorized: string;
	validtoken: string;
	usercreated: string;

	// ERRORS
	genericerror: string;
	databaseerror: string;
}
