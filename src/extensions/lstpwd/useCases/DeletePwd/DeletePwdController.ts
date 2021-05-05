import { Request, Response } from "express";

import { DeletePwdUseCase } from "./DeletePwdUseCase";
import { response } from "../../utils/response";
import { validatePasswordId } from "../../utils/validators";
import logger from "../../../../loaders/LoggerLoader";

export class DeletePwdController {
	constructor(private deletePwdUseCase: DeletePwdUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			let { password_id } = req.query;

			const passwordIdValidation = validatePasswordId(password_id);

			if (passwordIdValidation.error) {
				return res.status(400).json(
					response(true, "invaliddata", {
						stack: passwordIdValidation.message,
					})
				);
			}

			password_id = passwordIdValidation.value;

			await this.deletePwdUseCase.execute({
				user: { id: req.user.id },
				password: { id: password_id },
			});
			return res.json(response(false, "passworddeleted"));
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(true, "genericerror", { stack: err.message }));
		}
	}
}
