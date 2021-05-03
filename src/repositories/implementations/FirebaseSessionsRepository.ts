import logger from "../../loaders/LoggerLoader";
import { Code } from "../../entities/Code";
import { ISessionsRepository } from "../ISessionsRepository";
import { firestore } from "../../loaders/FirebaseLoader";
import { RefreshToken } from "../../entities/RefreshToken";

export class FirebaseSessionsRepository implements ISessionsRepository {
	async createNewRefreshToken(refreshToken: RefreshToken): Promise<void> {
		try {
			await firestore
				.collection("sessions")
				.doc(refreshToken.id)
				.create(refreshToken);
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async findRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
		try {
			const tokenQuery = await firestore
				.collection("sessions")
				.doc(refreshToken)
				.get();
			if (!tokenQuery.exists) {
				return null;
			}
			const tokenData = tokenQuery.data();
			const token: RefreshToken = {
				id: tokenData.id,
				validUntil: tokenData.validUntil,
				agent: tokenData.agent,
				ip: tokenData.ip,
				user: tokenData.user,
			};
			return token;
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async deleteRefreshToken(refreshToken: string): Promise<void> {
		try {
			await firestore.collection("sessions").doc(refreshToken).delete();
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}
