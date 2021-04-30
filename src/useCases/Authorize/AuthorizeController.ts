import response from "../../utils/response";
import logger from "../../loaders/LoggerLoader";
import { Request, Response } from "express";
import { AuthorizeUseCase } from "./AuthorizeUseCase";

export class AuthorizeController {
	constructor(private authorizeUseCase: AuthorizeUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			const agent = `${req.useragent?.browser} ${req.useragent?.version} ${req.useragent?.os} ${req.useragent?.platform} ${req.useragent?.source}`;
			const ip = req.realIp;

			const code = await this.authorizeUseCase.execute({ ip, agent });
			return res.json(response(false, "authorized", { code }));
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.json(response(false, "genericerror", { stack: err.message }));
		}
	}
}
