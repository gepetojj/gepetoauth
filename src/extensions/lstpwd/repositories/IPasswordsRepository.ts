import { Password } from "../entities/Password";

export interface IPasswordFindOptions {
	passwordId: string;
	ownerId?: string;
}

export interface IPasswordsRespository {
	createNewPassword(password: Password): Promise<void>;
	findPassword(options: IPasswordFindOptions): Promise<Password>;
	findAllPasswords(ownerId: string): Promise<Password[]>;
	deletePassword(passwordId: string): Promise<void>;
}
