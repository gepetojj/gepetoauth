"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../../entities/User");
const response_1 = require("../../utils/response");
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
class CreateUserUseCase {
    constructor(usersRepository, mailProvider) {
        this.usersRepository = usersRepository;
        this.mailProvider = mailProvider;
    }
    async execute(data) {
        try {
            const userExists = await this.usersRepository.findByUsername(data.username);
            const emailExists = await this.usersRepository.findByEmail(data.email);
            if (userExists || emailExists) {
                throw new Error("Usuário ou email já cadastrados.");
            }
            const password = await bcrypt_1.default.hash(data.password, 12);
            const user = new User_1.User({
                username: data.username,
                email: data.email,
                password,
                avatar: response_1.avatarURL,
                level: 0,
                state: {
                    banned: { is: false },
                    emailConfirmed: false,
                },
                register: {
                    date: 0,
                    agent: data.agent,
                    ip: data.ip,
                },
            });
            await this.usersRepository.createNewUser(user);
            await this.mailProvider.sendMail({
                to: {
                    name: data.username,
                    address: data.email,
                },
                from: {
                    name: "GepetoAuth",
                    address: "gepetosapplications@gmail.com",
                },
                subject: "Sua conta GepetoServices foi criada!",
                body: "Confirme seu email clicando neste link: <a href='https://google.com'>confirmar.</a>",
            });
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error("Houve um erro no banco de dados.");
        }
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
