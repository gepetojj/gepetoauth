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
	invalidendpoint: string;
	ratelimited: string;
}
