import { Request, Response } from "express";

import response from "../../utils/response";
import logger from "../../loaders/LoggerLoader";
import { VerifyUseCase } from "./VerifyUseCase";
import { validateAccessToken } from "../../utils/validators";

export class VerifyController {
	constructor(private verifyUseCase: VerifyUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			let accessToken = String(req.query.access_token);

			const accessTokenValidation = validateAccessToken(accessToken);
			if (accessTokenValidation.error) {
				return res.status(400).json(
					response(true, "invaliddata", {
						errors: accessTokenValidation.message,
					})
				);
			}

			accessToken = accessTokenValidation.value;
			const userData = await this.verifyUseCase.execute({ accessToken });
			return res.json(response(false, "validtoken", userData));
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(false, "databaseerror", { stack: err.message }));
		}
	}
}
