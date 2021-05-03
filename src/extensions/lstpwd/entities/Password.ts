import { createId } from "../../../utils/tokens";

export class Password {
	public readonly passwordId: string;

	public ownerId: string;
	public service: string;
	public icon: string;
	public passwordHash: string;
	public passwordIv: string;

	constructor(data: Omit<Password, "passwordId">, id?: string) {
		Object.assign(this, data);

		if (!id) {
			this.passwordId = createId();
		}
	}
}
