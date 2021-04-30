import logger from "../../loaders/LoggerLoader";
import { Code } from "../../entities/Code";
import { ISessionsRepository } from "../ISessionsRepository";
import { firestore } from "../../loaders/FirebaseLoader";
import { RefreshToken } from "../../entities/RefreshToken";

export class FirebaseSessionsRepository implements ISessionsRepository {
	async createNewCode(code: Code): Promise<void> {
		try {
			await firestore.collection("codes").doc(code.id).create(code);
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async findCode(codeId: string): Promise<Code | null> {
		try {
			const codeQuery = await firestore
				.collection("codes")
				.doc(codeId)
				.get();
			if (!codeQuery.exists) {
				return null;
			}
			const codeData = codeQuery.data();
			const code: Code = {
				id: codeData.id,
				validUntil: codeData.validUntil,
				agent: codeData.agent,
				ip: codeData.ip,
			};
			return code;
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async findCodeBySpec(spec: string, field: string): Promise<Code | null> {
		try {
			const codeQuery = await firestore
				.collection("codes")
				.where(spec, "==", field)
				.get();
			if (codeQuery.empty) {
				return null;
			}
			if (!codeQuery.docs[0].exists) {
				return null;
			}
			const codeData = codeQuery.docs[0].data();
			const code: Code = {
				id: codeData.id,
				validUntil: codeData.validUntil,
				agent: codeData.agent,
				ip: codeData.ip,
			};
			return code;
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async deleteCode(code: string): Promise<void> {
		try {
			await firestore.collection("codes").doc(code).delete();
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

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
