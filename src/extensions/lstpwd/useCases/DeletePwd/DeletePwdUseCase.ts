import { IPasswordsRespository } from "../../repositories/IPasswordsRepository";
import { IDeletePwdDTO } from "./DeletePwdDTO";
import logger from "../../../../loaders/LoggerLoader";

export class DeletePwdUseCase {
	constructor(private passwordsRepository: IPasswordsRespository) {}

	async execute(data: IDeletePwdDTO): Promise<void> {
		try {
			const passwordFindMethod = {
				ownerId: data.user.id,
				passwordId: data.password.id,
			};
			const passwordQuery = await this.passwordsRepository.findPassword(
				passwordFindMethod
			);

			if (!passwordQuery) {
				throw new Error("Senha inexistente ou você não é o dono dela.");
			}

			await this.passwordsRepository.deletePassword(
				passwordQuery.passwordId
			);
		} catch (err) {
			logger.error(err);
			throw new Error(err);
		}
	}
}
