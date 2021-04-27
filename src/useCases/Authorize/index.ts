import { FirebaseSessionsRepository } from "../../repositories/implementations/FirebaseSessionsRepository";
import { AuthorizeController } from "./AuthorizeController";
import { AuthorizeUseCase } from "./AuthorizeUseCase";

const firebaseSessionsRepository = new FirebaseSessionsRepository();

const authorizeUseCase = new AuthorizeUseCase(firebaseSessionsRepository);
const authorizeController = new AuthorizeController(authorizeUseCase);

export { authorizeUseCase, authorizeController };
