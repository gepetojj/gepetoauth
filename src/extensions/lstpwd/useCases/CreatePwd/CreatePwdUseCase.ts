import crypto from "crypto";

import { createId } from "../../../../utils/tokens";
import { Password } from "../../entities/Password";
import { IPasswordsRespository } from "../../repositories/IPasswordsRepository";
import { ICreatePwdDTO } from "./CreatePwdDTO";
import config from "../../config";
import logger from "../../../../loaders/LoggerLoader";

export class CreatePwdUseCase {
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

	async execute(data: ICreatePwdDTO) {
		try {
			return this.generateKey(data.user.name, config.passwordSalt)
				.then(async (key) => {
					const iv = crypto.randomBytes(16);
					const cipher = crypto.createCipheriv(
						"aes-256-cbc",
						key,
						iv
					);
					const passwordHash = Buffer.concat([
						cipher.update(data.password.password),
						cipher.final(),
					]);

					const passwordData: Password = {
						passwordId: createId(),
						ownerId: data.user.id,
						service: data.password.service,
						icon: data.password.icon,
						passwordHash: passwordHash.toString("hex"),
						passwordIv: iv.toString("hex"),
					};
					await this.passwordsRepository.createNewPassword(
						passwordData
					);
				})
				.catch((err) => {
					throw new Error(err);
				});
		} catch (err) {
			logger.error(err);
			throw new Error("Não foi possível salvar sua senha.");
		}
	}
}
