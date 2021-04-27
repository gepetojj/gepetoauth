import logger from "../../loaders/LoggerLoader";
import { firestore } from "../../loaders/FirebaseLoader";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class FirebaseUsersRepository implements IUsersRepository {
	async findByUsername(username: string): Promise<User | null> {
		try {
			const userQuery = await firestore
				.collection("users")
				.where("username", "==", username)
				.get();
			if (!userQuery.empty) {
				const data = userQuery.docs[0].data();
				const user: User = {
					id: data.id,
					username: data.username,
					email: data.email,
					password: data.password,
					avatar: data.avatar,
					level: data.level,
					state: data.state,
					register: data.register,
				};
				return user;
			}
			return null;
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		try {
			const userQuery = await firestore
				.collection("users")
				.where("email", "==", email)
				.get();
			if (!userQuery.empty) {
				const data = userQuery.docs[0].data();
				const user: User = {
					id: data.id,
					username: data.username,
					email: data.email,
					password: data.password,
					avatar: data.avatar,
					level: data.level,
					state: data.state,
					register: data.register,
				};
				return user;
			}
			return null;
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async createNewUser(user: User): Promise<void> {
		try {
			const userData: User = {
				id: user.id,
				username: user.username,
				email: user.email,
				password: user.password,
				avatar: user.avatar,
				level: user.level,
				state: user.state,
				register: user.register,
			};
			await firestore.collection("users").doc(user.id).create(userData);
		} catch (err) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}
