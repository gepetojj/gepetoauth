import bcrypt from "bcrypt";

import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";
import { avatarURL } from "../../utils/response";
import { IMailProvider } from "../../providers/IMailProvider";
import logger from "../../loaders/LoggerLoader";

export class CreateUserUseCase {
	constructor(
		private usersRepository: IUsersRepository,
		private mailProvider: IMailProvider
	) {}

	async execute(data: ICreateUserRequestDTO) {
		try {
			const userExists = await this.usersRepository.findByUsername(
				data.username
			);
			const emailExists = await this.usersRepository.findByEmail(
				data.email
			);

			if (userExists || emailExists) {
				throw new Error("Usuário ou email já cadastrados.");
			}

			const password = await bcrypt.hash(data.password, 12);
			const user = new User({
				username: data.username,
				email: data.email,
				password,
				avatar: avatarURL,
				level: 0,
				state: {
					banned: { is: false },
					emailConfirmed: false,
				},
				register: {
					date: 0,
					agent: data.agent,
					ip: data.ip,
				},
			});

			await this.usersRepository.createNewUser(user);
			await this.mailProvider.sendMail({
				to: {
					name: data.username,
					address: data.email,
				},
				from: {
					name: "GepetoAuth",
					address: "gepetosapplications@gmail.com",
				},
				subject: "Sua conta GepetoServices foi criada!",
				body:
					"Confirme seu email clicando neste link: <a href='https://google.com'>confirmar.</a>",
			});
		} catch (err) {
			logger.error(err);
			throw new Error("Houve um erro no banco de dados.");
		}
	}
}
