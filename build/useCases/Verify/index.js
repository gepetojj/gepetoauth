"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyController = exports.verifyUseCase = void 0;
const VerifyController_1 = require("./VerifyController");
const VerifyUseCase_1 = require("./VerifyUseCase");
const verifyUseCase = new VerifyUseCase_1.VerifyUseCase();
exports.verifyUseCase = verifyUseCase;
const verifyController = new VerifyController_1.VerifyController(verifyUseCase);
exports.verifyController = verifyController;
