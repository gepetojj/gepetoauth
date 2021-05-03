import { Request, Response } from "express";

import { validateRefreshToken } from "../../utils/validators";
import response from "../../utils/response";
import logger from "../../loaders/LoggerLoader";
import { RefreshUseCase } from "./RefreshUseCase";

export class RefreshController {
	constructor(private refreshUseCase: RefreshUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			let refreshToken = String(req.query.refresh_token);
			const agent = `${req.useragent?.browser} ${req.useragent?.version} ${req.useragent?.os} ${req.useragent?.platform} ${req.useragent?.source}`;
			const ip = req.realIp;

			const refreshTokenValidation = validateRefreshToken(refreshToken);
			if (refreshTokenValidation.error) {
				return res.status(400).json(
					response(true, "invaliddata", {
						errors: refreshTokenValidation.message,
					})
				);
			}

			refreshToken = refreshTokenValidation.value;
			const newAccessToken = await this.refreshUseCase.execute({
				refreshToken,
				agent,
				ip,
			});
			return res.json(
				response(false, "validtoken", { accessToken: newAccessToken })
			);
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(true, "genericerror", { stack: err.message }));
		}
	}
}
