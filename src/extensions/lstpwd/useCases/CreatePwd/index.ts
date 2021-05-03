import { AirtablePwdsRepository } from "../../repositories/implementations/AirtablePwdsRepository";
import { CreatePwdController } from "./CreatePwdController";
import { CreatePwdUseCase } from "./CreatePwdUseCase";

const airtablePwdsRepository = new AirtablePwdsRepository();

const createPwdUseCase = new CreatePwdUseCase(airtablePwdsRepository);
const createPwdController = new CreatePwdController(createPwdUseCase);

export { createPwdUseCase, createPwdController };
