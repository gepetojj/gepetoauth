import { VerifyController } from "./VerifyController";
import { VerifyUseCase } from "./VerifyUseCase";

const verifyUseCase = new VerifyUseCase();
const verifyController = new VerifyController(verifyUseCase);

export { verifyUseCase, verifyController };
