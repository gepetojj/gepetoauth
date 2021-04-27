"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = exports.createUserUseCase = void 0;
const MailgunMailProvider_1 = require("../../providers/implementations/MailgunMailProvider");
const MailtrapMailProvider_1 = require("../../providers/implementations/MailtrapMailProvider");
const FirebaseUsersRepository_1 = require("../../repositories/implementations/FirebaseUsersRepository");
const CreateUserController_1 = require("./CreateUserController");
const CreateUserUseCase_1 = require("./CreateUserUseCase");
const mailtrapMailProvider = new MailtrapMailProvider_1.MailtrapMailProvider();
const mailgunMailProvider = new MailgunMailProvider_1.MailgunMailProvider();
const firebaseUsersRepository = new FirebaseUsersRepository_1.FirebaseUsersRepository();
const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(firebaseUsersRepository, process.env.NODE_ENV === "development"
    ? mailtrapMailProvider
    : mailgunMailProvider);
exports.createUserUseCase = createUserUseCase;
const createUserController = new CreateUserController_1.CreateUserController(createUserUseCase);
exports.createUserController = createUserController;
