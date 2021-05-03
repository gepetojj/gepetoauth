import Airtable from "airtable";
import config from "../../config";

import { Password } from "../../entities/Password";
import {
	IPasswordFindOptions,
	IPasswordsRespository,
} from "../IPasswordsRepository";
import logger from "../../../../loaders/LoggerLoader";

export class AirtablePwdsRepository implements IPasswordsRespository {
	async createNewPassword(password: Password): Promise<void> {
		const database = new Airtable({ apiKey: config.airtableApiKey }).base(
			"app1O0kobigdHsrhH"
		);

		return await database("Passwords")
			.create({
				password_id: password.passwordId,
				owner_id: password.ownerId,
				service: password.service,
				icon: password.icon,
				password_hash: password.passwordHash,
				password_iv: password.passwordIv,
			})
			.then(() => {
				return;
			})
			.catch((err) => {
				logger.error(err);
				throw new Error(err);
			});
	}

	async findPassword(options: IPasswordFindOptions): Promise<Password> {
		return new Password({
			ownerId: "",
			service: "",
			icon: "",
			passwordHash: "",
			passwordIv: "",
		});
	}

	async deletePassword(options: IPasswordFindOptions): Promise<void> {}
}
