import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/tokens";
import { validateAccessToken } from "../utils/validators";
import { DayjsLoader } from "../loaders/DayjsLoader";
import response from "../utils/response";

export function authorize() {
	return async function authorize(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const dayjs = new DayjsLoader().execute();
		const authorization = req.headers.authorization;

		if (!authorization) {
			return res.status(401).json(
				response(true, "invaliddata", {
					stack: "O header de autorização está faltando.",
				})
			);
		}

		const authorizationSplitted = authorization.split(" ");
		const bearer = authorizationSplitted[0];
		const tokenValidation = validateAccessToken(authorizationSplitted[1]);
		if (bearer === "Bearer" && !tokenValidation.error) {
			const token = tokenValidation.value;
			const { valid, payload } = verifyAccessToken(token);
			if (!valid) {
				return res.status(401).json(
					response(true, "expiredatoken", {
						stack: "Access token expirado.",
					})
				);
			}

			const nowInTimestamp = dayjs().valueOf();
			if (nowInTimestamp > payload.validUntil) {
				return res.status(401).json(
					response(true, "expiredatoken", {
						stack: "Access token expirado.",
					})
				);
			}

			req.user = {
				id: payload.payload.id,
				name: payload.payload.username,
			};
			return next();
		}
		return res.status(400).json(
			response(true, "invalidatoken", {
				stack: "O header de autorização está inválido.",
			})
		);
	};
}
