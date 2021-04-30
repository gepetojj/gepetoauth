import { Request, Response, NextFunction } from "express";
import {
	RateLimiterMemory,
	IRateLimiterOptions,
	RateLimiterRes,
} from "rate-limiter-flexible";

import response from "../utils/response";

export function rateLimiter() {
	function getHeaders(rateLimiterData: RateLimiterRes, points: number) {
		const headers = {
			"Retry-After": rateLimiterData.msBeforeNext / 1000,
			"X-RateLimit-Limit": points,
			"X-RateLimit-Remaining": rateLimiterData.remainingPoints,
			"X-RateLimit-Reset": new Date(
				Date.now() + rateLimiterData.msBeforeNext
			),
		};
		return headers;
	}

	return async function rateLimiter(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const ip = req.realIp;
		const options: IRateLimiterOptions = {
			points: 10,
			duration: 1800, // 30 minutos em segundos
		};

		const rateLimiter = new RateLimiterMemory(options);
		return rateLimiter
			.consume(ip, 1)
			.then((response) => {
				const headers = getHeaders(response, options.points);
				res.set(headers);
				return next();
			})
			.catch((rateLimiterResponse) => {
				const headers = getHeaders(rateLimiterResponse, options.points);
				res.set(headers);
				return res.status(429).json(response(true, "ratelimited"));
			});
	};
}
