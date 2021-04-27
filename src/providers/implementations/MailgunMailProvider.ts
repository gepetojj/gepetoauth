import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import config from "../../config";
import { IData, IMailProvider } from "../IMailProvider";

export class MailgunMailProvider implements IMailProvider {
	private transporter: Mail;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: "smtp.mailgun.org",
			port: 587,
			auth: {
				user: config.mailgunUser,
				pass: config.mailgunPass,
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
