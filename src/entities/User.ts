import { createId } from "../utils/tokens";

export class User {
	public readonly id: string;

	public username: string;
	public email: string;
	public password: string;
	public avatar: string;
	public level: number;
	public state: {
		banned: { is: boolean; reason?: string; date?: number };
		emailConfirmed: boolean;
	};
	public register: {
		date: number;
		agent: string;
		ip: string;
	};

	constructor(data: Omit<User, "id">, id?: string) {
		Object.assign(this, data);

		if (!id) {
			this.id = createId();
		}
	}
}
