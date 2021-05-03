import { Request, Response } from "express";

import { CreatePwdUseCase } from "./CreatePwdUseCase";
import { response } from "../../utils/response";
import {
	validateIcon,
	validatePassword,
	validateService,
} from "../../utils/validators";
import logger from "../../../../loaders/LoggerLoader";

export class CreatePwdController {
	constructor(private createPwdUseCase: CreatePwdUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			let { service, password } = req.body;

			const serviceValidation = validateService(service);
			const passwordValidation = validatePassword(password);

			if (serviceValidation.error || passwordValidation.error) {
				return res.status(400).json(
					response(true, "invaliddata", {
						stack:
							serviceValidation.message ||
							passwordValidation.message,
					})
				);
			}

			service = serviceValidation.value;
			const icon = "verified-user";
			password = passwordValidation.value;

			await this.createPwdUseCase.execute({
				user: req.user,
				password: { service, icon, password },
			});
			return res.json(response(false, "passwordcreated"));
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(true, "genericerror", { stack: err.message }));
		}
	}
}
