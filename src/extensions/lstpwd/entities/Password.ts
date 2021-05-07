export class Password {
	public readonly passwordId: string;

	public ownerId: string;
	public service: string;
	public icon: string;
	public password?: string;
	public passwordHash: string;
	public passwordIv: string;

	constructor(data: Password) {
		Object.assign(this, data);
	}
}
