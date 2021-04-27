import { Request, Response, NextFunction } from "express";
import { HstsOptions } from "../utils/types";

export function hsts(options: HstsOptions) {
	const DEFAULT_MAX_AGE = 180 * 24 * 60 * 60;

	const maxAge = options.maxAge ? options.maxAge : DEFAULT_MAX_AGE;
	const includeSubDomains = options.includeSubDomains
		? options.includeSubDomains
		: false;
	const preload = options.preload ? options.preload : false;
	const setIf = options.setIf
		? options.setIf
		: () => {
				return true;
		  };

	if (maxAge < 0) {
		throw new RangeError("HSTS maxAge must be nonnegative.");
	}

	let header = "max-age=" + Math.round(maxAge);
	if (includeSubDomains) {
		header += "; includeSubDomains";
	}
	if (preload) {
		header += "; preload";
	}

	return function hsts(req: Request, res: Response, next: NextFunction) {
		if (setIf(req, res)) {
			res.setHeader("Strict-Transport-Security", header);
		}

		next();
	};
}
