require("dotenv").config();
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import config from "../../config";
import { IData, IMailProvider } from "../IMailProvider";

export class MailtrapMailProvider implements IMailProvider {
	private transporter: Mail;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: config.mailtrapUser,
				pass: config.mailtrapPass,
			},
		});
	}

	async sendMail(data: IData): Promise<void> {
		await this.transporter.sendMail({
			to: data.to,
			from: data.from,
			subject: data.subject,
			html: data.body,
		});
	}
}
