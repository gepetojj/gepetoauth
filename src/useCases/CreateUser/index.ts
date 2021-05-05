import { MailgunMailProvider } from "../../providers/implementations/MailgunMailProvider";
import { MailtrapMailProvider } from "../../providers/implementations/MailtrapMailProvider";
import { FirebaseUsersRepository } from "../../repositories/implementations/FirebaseUsersRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";
import config from "../../config";

const mailtrapMailProvider = new MailtrapMailProvider();
const mailgunMailProvider = new MailgunMailProvider();
const firebaseUsersRepository = new FirebaseUsersRepository();

const createUserUseCase = new CreateUserUseCase(
	firebaseUsersRepository,
	config.dev || config.test ? mailtrapMailProvider : mailgunMailProvider
);

const createUserController = new CreateUserController(createUserUseCase);

export { createUserUseCase, createUserController };
