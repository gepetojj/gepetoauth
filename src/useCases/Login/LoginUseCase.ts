import bcrypt from "bcrypt";

import { ISessionsRepository } from "../../repositories/ISessionsRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ILoginDTO } from "./LoginDTO";
import { DayjsLoader } from "../../loaders/DayjsLoader";
import { createAccessToken, createRefreshToken } from "../../utils/tokens";

export class LoginUseCase {
	constructor(
		private sessionsRepository: ISessionsRepository,
		private usersRepository: IUsersRepository
	) {}

	async execute(
		data: ILoginDTO
	): Promise<{ accessToken: string; refreshToken: string }> {
		const dayjs = new DayjsLoader().execute();

		const codeExists = await this.sessionsRepository.findCode(data.code);
		if (!codeExists) {
			throw new Error("Code inválido.");
		}

		const nowInTimestamp = dayjs().valueOf();
		if (nowInTimestamp > codeExists.validUntil) {
			throw new Error("Code expirado.");
		}

		if (codeExists.agent === data.agent && codeExists.ip === data.ip) {
			const userExists = await this.usersRepository.findByUsername(
				data.username
			);
			if (!userExists) {
				throw new Error("Usuário inexistente.");
			}

			const passwordMatch = await bcrypt.compare(
				data.password,
				userExists.password
			);
			if (!passwordMatch) {
				throw new Error("Senha inválida.");
			}

			const unsensitiveUserData = {
				id: userExists.id,
				username: userExists.username,
				email: userExists.email,
				avatar: userExists.avatar,
				level: userExists.level,
				registerDate: userExists.register.date,
				state: userExists.state,
			};
			const refreshToken = createRefreshToken();
			const refreshTokenValidity = dayjs().add(7, "days").valueOf();
			await this.sessionsRepository.createNewRefreshToken({
				id: refreshToken,
				validUntil: refreshTokenValidity,
				agent: data.agent,
				ip: data.ip,
				user: unsensitiveUserData,
			});
			const accessToken = createAccessToken(unsensitiveUserData);

			await this.sessionsRepository.deleteCode(data.code);
			return { refreshToken, accessToken };
		}
		throw new Error(
			"Dispositivo inválido. Tente novamente usando o mesmo dispositivo que antes."
		);
	}
}
