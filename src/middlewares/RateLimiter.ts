import { Request, Response, NextFunction } from "express";
import {
	RateLimiterRedis,
	RateLimiterRes,
	IRateLimiterStoreOptions,
} from "rate-limiter-flexible";
import redis from "redis";

import response from "../utils/response";
import config from "../config";
import logger from "../loaders/LoggerLoader";

export function rateLimiter() {
	const redisClient = redis.createClient({
		enable_offline_queue: false,
		host: config.redisServer,
		port: config.redisPort,
		password: config.redisPass,
	});

	redisClient.on("error", (err) => {
		logger.error(err);
		throw new Error(err);
	});

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
		const options: IRateLimiterStoreOptions = {
			storeClient: redisClient,
			points: 20,
			duration: 1800, // 30 minutos em segundos
			execEvenly: false,
			blockDuration: 30,
			keyPrefix: "galimiter",
		};

		const rateLimiter = new RateLimiterRedis(options);
		if (config.test) {
			return next();
		}
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
