import { Request, Response } from "express";

import { CreateUserUseCase } from "./CreateUserUseCase";
import {
	validateUsername,
	validateEmail,
	validatePassword,
} from "../../utils/validators";
import response from "../../utils/response";

export class CreateUserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		let { username, email, password } = req.body;
		const agent = `${req.useragent?.browser} ${req.useragent?.version} ${req.useragent?.os} ${req.useragent?.platform} ${req.useragent?.source}`;
		const ip = req.realIp;

		const usernameValidation = validateUsername(username);
		const emailValidation = validateEmail(email);
		const passwordValidation = validatePassword(password);

		if (
			usernameValidation.error ||
			emailValidation.error ||
			passwordValidation.error
		) {
			return res.status(400).json(
				response(true, "invaliddata", {
					errors:
						usernameValidation.message ||
						emailValidation.message ||
						passwordValidation.message,
				})
			);
		}

		username = usernameValidation.value;
		email = emailValidation.value;

		try {
			await this.createUserUseCase.execute({
				username,
				email,
				password,
				agent,
				ip,
			});
			return res.status(201).json(response(false, "usercreated"));
		} catch (err) {
			return res
				.status(500)
				.json(response(true, "genericerror", { stack: err.message }));
		}
	}
}
