import { DayjsLoader } from "../../loaders/DayjsLoader";
import { ISessionsRepository } from "../../repositories/ISessionsRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { createAccessToken } from "../../utils/tokens";
import { IRefreshDTO } from "./RefreshDTO";

export class RefreshUseCase {
	constructor(
		private sessionsRepository: ISessionsRepository,
		private usersRepository: IUsersRepository
	) {}

	async execute(data: IRefreshDTO): Promise<string> {
		const dayjs = new DayjsLoader().execute();
		const tokenExists = await this.sessionsRepository.findRefreshToken(
			data.refreshToken
		);
		if (!tokenExists) {
			throw new Error("Refresh token inválido.");
		}

		const nowInTimestamp = dayjs().valueOf();
		if (nowInTimestamp > tokenExists.validUntil) {
			throw new Error("Refresh token expirado.");
		}

		if (tokenExists.agent === data.agent && tokenExists.ip === data.ip) {
			const userStillExists = await this.usersRepository.findByUsername(
				tokenExists.user.username
			);
			if (!userStillExists) {
				throw new Error("Este usuário não existe mais.");
			}

			if (userStillExists.state.banned.is) {
				throw new Error("Este usuário está banido.");
			}

			/* if (!userStillExists.state.emailConfirmed) {
				throw new Error("Este usuário ainda não confirmou o email.");
			} */

			const unsensitiveUserData = {
				id: userStillExists.id,
				username: userStillExists.username,
				email: userStillExists.email,
				avatar: userStillExists.avatar,
				level: userStillExists.level,
				registerDate: userStillExists.register.date,
				state: userStillExists.state,
			};
			const newAccessToken = createAccessToken(unsensitiveUserData);
			return newAccessToken;
		}
		throw new Error(
			"Dispositivo inválido. Tente novamente usando o mesmo dispositivo que antes."
		);
	}
}
