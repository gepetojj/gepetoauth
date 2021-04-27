"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailtrapMailProvider = void 0;
require("dotenv").config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
class MailtrapMailProvider {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: config_1.default.mailtrapUser,
                pass: config_1.default.mailtrapPass,
            },
        });
    }
    async sendMail(data) {
        await this.transporter.sendMail({
            to: data.to,
            from: data.from,
            subject: data.subject,
            html: data.body,
        });
    }
}
exports.MailtrapMailProvider = MailtrapMailProvider;
