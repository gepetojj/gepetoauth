export class Code {
	public readonly id: string;
	public validUntil: number;
	public agent: string;
	public ip: string;

	constructor(data: Code) {
		Object.assign(this, data);
	}
}
