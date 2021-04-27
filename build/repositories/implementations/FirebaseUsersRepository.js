"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseUsersRepository = void 0;
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
const FirebaseLoader_1 = require("../../loaders/FirebaseLoader");
class FirebaseUsersRepository {
    async findByUsername(username) {
        try {
            const userQuery = await FirebaseLoader_1.firestore
                .collection("users")
                .where("username", "==", username)
                .get();
            if (!userQuery.empty) {
                const data = userQuery.docs[0].data();
                const user = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    avatar: data.avatar,
                    level: data.level,
                    state: data.state,
                    register: data.register,
                };
                return user;
            }
            return null;
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
    async findByEmail(email) {
        try {
            const userQuery = await FirebaseLoader_1.firestore
                .collection("users")
                .where("email", "==", email)
                .get();
            if (!userQuery.empty) {
                const data = userQuery.docs[0].data();
                const user = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    avatar: data.avatar,
                    level: data.level,
                    state: data.state,
                    register: data.register,
                };
                return user;
            }
            return null;
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
    async createNewUser(user) {
        try {
            const userData = {
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                avatar: user.avatar,
                level: user.level,
                state: user.state,
                register: user.register,
            };
            await FirebaseLoader_1.firestore.collection("users").doc(user.id).create(userData);
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
}
exports.FirebaseUsersRepository = FirebaseUsersRepository;
