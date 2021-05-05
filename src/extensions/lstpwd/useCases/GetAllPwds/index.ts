import { FirebasePwdsRepository } from "../../repositories/implementations/FirebasePwdsRepository";
import { GetAllPwdsController } from "./GetAllPwdsController";
import { GetAllPwdsUseCase } from "./GetAllPwdsUseCase";

const firebasePasswordsRepository = new FirebasePwdsRepository();

const getAllPwdsUseCase = new GetAllPwdsUseCase(firebasePasswordsRepository);
const getAllPwdsController = new GetAllPwdsController(getAllPwdsUseCase);

export { getAllPwdsUseCase, getAllPwdsController };
