import { AccessToken } from "../utils/tokens";

export class RefreshToken {
	public readonly id: string;
	public validUntil: number;
	public agent: string;
	public ip: string;
	public user: AccessToken["payload"];

	constructor(data: RefreshToken) {
		Object.assign(this, data);
	}
}
