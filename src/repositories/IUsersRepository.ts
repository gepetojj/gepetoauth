import { User } from "../entities/User";

export interface IUsersRepository {
	findByUsername(username: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	createNewUser(user: User): Promise<void>;
}
