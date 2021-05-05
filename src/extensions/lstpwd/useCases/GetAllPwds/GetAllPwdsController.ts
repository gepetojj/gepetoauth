import { Request, Response } from "express";

import { response } from "../../utils/response";
import { GetAllPwdsUseCase } from "./GetAllPwdsUseCase";
import logger from "../../../../loaders/LoggerLoader";

export class GetAllPwdsController {
	constructor(private getAllPwdsUseCase: GetAllPwdsUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			const passwords = await this.getAllPwdsUseCase.execute({
				user: { id: req.user.id },
			});
			return res.json(response(false, "yourpasswords", { passwords }));
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(true, "genericerror", { stack: err.message }));
		}
	}
}
