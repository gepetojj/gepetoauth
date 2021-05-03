import { Request, Response } from "express";

import response from "../../utils/response";
import logger from "../../loaders/LoggerLoader";
import { LoginUseCase } from "./LoginUseCase";
import { validatePassword, validateUsername } from "../../utils/validators";

export class LoginController {
	constructor(private loginUseCase: LoginUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			let { username, password } = req.body;
			const agent = `${req.useragent?.browser} ${req.useragent?.version} ${req.useragent?.os} ${req.useragent?.platform} ${req.useragent?.source}`;
			const ip = req.realIp;

			const usernameValidation = validateUsername(username);
			const passwordValidation = validatePassword(password);

			if (usernameValidation.error || passwordValidation.error) {
				return res.status(400).json(
					response(true, "invaliddata", {
						errors:
							usernameValidation.message ||
							passwordValidation.message,
					})
				);
			}

			username = usernameValidation.value;
			password = passwordValidation.value;

			const {
				accessToken,
				refreshToken,
			} = await this.loginUseCase.execute({
				username,
				password,
				agent,
				ip,
			});
			return res.json(
				response(false, "authorized", { accessToken, refreshToken })
			);
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(true, "genericerror", { stack: err.message }));
		}
	}
}
