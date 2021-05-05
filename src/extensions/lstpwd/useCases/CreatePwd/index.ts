import { FirebasePwdsRepository } from "../../repositories/implementations/FirebasePwdsRepository";
import { CreatePwdController } from "./CreatePwdController";
import { CreatePwdUseCase } from "./CreatePwdUseCase";

const firebasePwdsRepository = new FirebasePwdsRepository();

const createPwdUseCase = new CreatePwdUseCase(firebasePwdsRepository);
const createPwdController = new CreatePwdController(createPwdUseCase);

export { createPwdUseCase, createPwdController };
