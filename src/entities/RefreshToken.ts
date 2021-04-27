export class RefreshToken {
	public readonly id: string;
	public validUntil: number;
	public agent: string;
	public ip: string;

	constructor(data: RefreshToken) {
		Object.assign(this, data);
	}
}
