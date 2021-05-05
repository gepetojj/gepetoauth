import { Password } from "../../entities/Password";
import { IPasswordsRespository } from "../../repositories/IPasswordsRepository";
import { IGetAllPwdsDTO } from "./GetAllPwdsDTO";
import logger from "../../../../loaders/LoggerLoader";

export class GetAllPwdsUseCase {
	constructor(private passwordsRepository: IPasswordsRespository) {}

	async execute(data: IGetAllPwdsDTO): Promise<Password[]> {
		try {
			const passwords = this.passwordsRepository.findAllPasswords(
				data.user.id
			);
			return passwords;
		} catch (err) {
			logger.error(err);
			throw new Error("Não foi possível retornar suas senhas.");
		}
	}
}
