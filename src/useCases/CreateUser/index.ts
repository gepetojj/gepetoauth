import { MailgunMailProvider } from "../../providers/implementations/MailgunMailProvider";
import { MailtrapMailProvider } from "../../providers/implementations/MailtrapMailProvider";
import { FirebaseUsersRepository } from "../../repositories/implementations/FirebaseUsersRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

const mailtrapMailProvider = new MailtrapMailProvider();
const mailgunMailProvider = new MailgunMailProvider();
const firebaseUsersRepository = new FirebaseUsersRepository();

const createUserUseCase = new CreateUserUseCase(
	firebaseUsersRepository,
	process.env.NODE_ENV === "development"
		? mailtrapMailProvider
		: mailgunMailProvider
);

const createUserController = new CreateUserController(createUserUseCase);

export { createUserUseCase, createUserController };
