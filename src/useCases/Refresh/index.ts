import { FirebaseSessionsRepository } from "../../repositories/implementations/FirebaseSessionsRepository";
import { FirebaseUsersRepository } from "../../repositories/implementations/FirebaseUsersRepository";
import { RefreshController } from "./RefreshController";
import { RefreshUseCase } from "./RefreshUseCase";

const firebaseSessionsRepository = new FirebaseSessionsRepository();
const firebaseUsersRepository = new FirebaseUsersRepository();

const refreshUseCase = new RefreshUseCase(
	firebaseSessionsRepository,
	firebaseUsersRepository
);

const refreshController = new RefreshController(refreshUseCase);

export { refreshUseCase, refreshController };
