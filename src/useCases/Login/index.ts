import { FirebaseSessionsRepository } from "../../repositories/implementations/FirebaseSessionsRepository";
import { FirebaseUsersRepository } from "../../repositories/implementations/FirebaseUsersRepository";
import { LoginController } from "./LoginController";
import { LoginUseCase } from "./LoginUseCase";

const firebaseSessionsRepository = new FirebaseSessionsRepository();
const firebaseUsersRepository = new FirebaseUsersRepository();

const loginUseCase = new LoginUseCase(
	firebaseSessionsRepository,
	firebaseUsersRepository
);

const loginController = new LoginController(loginUseCase);

export { loginUseCase, loginController };
