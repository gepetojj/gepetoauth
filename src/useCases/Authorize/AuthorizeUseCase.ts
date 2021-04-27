import logger from "../../loaders/LoggerLoader";
import { createRefreshToken } from "../../utils/tokens";
import { DayjsLoader } from "../../loaders/DayjsLoader";
import { ISessionsRepository } from "../../repositories/ISessionsRepository";
import { IAuthorizeDTO } from "./AuthorizeDTO";

export class AuthorizeUseCase {
	constructor(private sessionsRepository: ISessionsRepository) {}

	async execute(data: IAuthorizeDTO): Promise<string> {
		try {
			const code = createRefreshToken();
			const dayjs = new DayjsLoader().execute();

			const codeWithAgentExists = await this.sessionsRepository.findCodeBySpec(
				"agent",
				data.agent
			);
			const codeWithIpExists = await this.sessionsRepository.findCodeBySpec(
				"ip",
				data.ip
			);

			if (codeWithAgentExists && codeWithIpExists) {
				throw new Error("Este usuário já tem um code registrado.");
			}

			await this.sessionsRepository.createNewCode({
				id: code,
				validUntil: dayjs().add(15, "minutes").valueOf(),
				agent: data.agent,
				ip: data.ip,
			});
			return code;
		} catch (err) {
			logger.error(err);
			throw new Error(err.message || "Houve um erro no banco de dados.");
		}
	}
}
