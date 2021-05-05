import { FirebasePwdsRepository } from "../../repositories/implementations/FirebasePwdsRepository";
import { DeletePwdController } from "./DeletePwdController";
import { DeletePwdUseCase } from "./DeletePwdUseCase";

const firebasePasswordsRepository = new FirebasePwdsRepository();

const deletePwdUseCase = new DeletePwdUseCase(firebasePasswordsRepository);
const deletePwdController = new DeletePwdController(deletePwdUseCase);

export { deletePwdUseCase, deletePwdController };
