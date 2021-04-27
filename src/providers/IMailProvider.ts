export interface ITarget {
	name: string;
	address: string;
}

export interface IData {
	to: ITarget;
	from: ITarget;
	subject: string;
	body: string;
}

export interface IMailProvider {
	sendMail(data: IData): Promise<void>;
}
