import { firestore } from "../../../../loaders/FirebaseLoader";
import { Password } from "../../entities/Password";
import {
	IPasswordFindOptions,
	IPasswordsRespository,
} from "../IPasswordsRepository";
import logger from "../../../../loaders/LoggerLoader";

export class FirebasePwdsRepository implements IPasswordsRespository {
	constructor() {}

	async createNewPassword(password: Password): Promise<void> {
		try {
			await firestore
				.collection("passwords")
				.doc(password.passwordId)
				.create(password);
		} catch (err) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async findPassword(options: IPasswordFindOptions): Promise<Password> {
		try {
			let passwordQuery: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
			if (options.ownerId) {
				passwordQuery = await firestore
					.collection("passwords")
					.where("passwordId", "==", options.passwordId)
					.where("ownerId", "==", options.ownerId)
					.get();
			} else {
				passwordQuery = await firestore
					.collection("passwords")
					.where("passwordId", "==", options.passwordId)
					.get();
			}

			if (passwordQuery.empty) {
				return null;
			}
			const passwordData = passwordQuery.docs[0].data();
			const password: Password = {
				passwordId: passwordData.passwordId,
				ownerId: passwordData.ownerId,
				service: passwordData.service,
				icon: passwordData.icon,
				passwordHash: passwordData.passwordHash,
				passwordIv: passwordData.passwordIv,
			};
			return password;
		} catch (err) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async findAllPasswords(ownerId: string): Promise<Password[]> {
		try {
			const passwordQuery = await firestore
				.collection("passwords")
				.where("ownerId", "==", ownerId)
				.get();
			if (passwordQuery.empty) {
				return null;
			}
			let passwordsArray: Password[] = [];
			passwordQuery.docs.forEach((doc) => {
				const passwordData = doc.data();
				const password = new Password({
					passwordId: passwordData.passwordId,
					ownerId: passwordData.ownerId,
					service: passwordData.service,
					icon: passwordData.icon,
					passwordHash: passwordData.passwordHash,
					passwordIv: passwordData.passwordIv,
				});
				passwordsArray.push(password);
			});
			return passwordsArray;
		} catch (err) {
			logger.error(err);
			throw new Error(err);
		}
	}

	async deletePassword(passwordId: string): Promise<void> {
		try {
			await firestore.collection("passwords").doc(passwordId).delete();
		} catch (err) {
			logger.error(err);
			throw new Error(err);
		}
	}
}
