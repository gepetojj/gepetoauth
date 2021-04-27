"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailgunMailProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
class MailgunMailProvider {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: "smtp.mailgun.org",
            port: 587,
            auth: {
                user: config_1.default.mailgunUser,
                pass: config_1.default.mailgunPass,
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
exports.MailgunMailProvider = MailgunMailProvider;
