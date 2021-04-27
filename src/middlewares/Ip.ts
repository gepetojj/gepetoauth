import { Request, Response, NextFunction } from "express";
import requestIp from "request-ip";

export function userIp() {
	return function userIp(req: Request, res: Response, next: NextFunction) {
		let userIp = requestIp.getClientIp(req);
		req.realIp = userIp;
		next();
	};
}
