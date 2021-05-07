import crypto from "crypto";

import { Password } from "../../entities/Password";
import { IPasswordsRespository } from "../../repositories/IPasswordsRepository";
import { IGetAllPwdsDTO } from "./GetAllPwdsDTO";
import logger from "../../../../loaders/LoggerLoader";
import config from "../../config";

export class GetAllPwdsUseCase {
	constructor(private passwordsRepository: IPasswordsRespository) {}

	private async generateKey(username: string, salt: string): Promise<string> {
		const promise = new Promise<string>((resolve, reject) => {
			const usernameSanitized = username.toLowerCase().trim();
			crypto.pbkdf2(
				usernameSanitized,
				salt,
				100000,
				32,
				"sha256",
				(err, key) => {
					if (err) {
						return reject(err);
					}
					const keyToHex = key.toString("hex").substr(0, 32);
					return resolve(keyToHex);
				}
			);
		});
		return promise;
	}

	private async decryptArray(username: string, array: Password[]) {
		let list: Password[] = [];
		const key = await this.generateKey(username, config.passwordSalt);
		array.forEach((password) => {
			const decipher = crypto.createDecipheriv(
				"aes-256-cbc",
				key,
				Buffer.from(password.passwordIv, "hex")
			);
			const passwordHash = Buffer.concat([
				decipher.update(Buffer.from(password.passwordHash, "hex")),
				decipher.final(),
			]);
			list.push({
				...password,
				password: passwordHash.toString("utf8"),
			});
		});
		return list;
	}

	async execute(data: IGetAllPwdsDTO): Promise<Password[]> {
		try {
			const passwords = await this.passwordsRepository.findAllPasswords(
				data.user.id
			);
			const decryptedPasswords = await this.decryptArray(
				data.user.name,
				passwords
			);
			return decryptedPasswords;
		} catch (err) {
			logger.error(err);
			throw new Error("Não foi possível retornar suas senhas.");
		}
	}
}
