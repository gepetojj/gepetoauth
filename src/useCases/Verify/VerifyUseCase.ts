import { DayjsLoader } from "../../loaders/DayjsLoader";
import { AccessToken, verifyAccessToken } from "../../utils/tokens";
import { IVerifyDTO } from "./VerifyDTO";

export class VerifyUseCase {
	async execute(data: IVerifyDTO): Promise<{ data: AccessToken["payload"] }> {
		const dayjs = new DayjsLoader().execute();

		const { valid, payload } = verifyAccessToken(data.accessToken);
		if (!valid) {
			throw new Error("Access token inválido.");
		}

		const nowInTimestamp = dayjs().valueOf();
		if (nowInTimestamp > payload.validUntil) {
			throw new Error("Access token expirado.");
		}

		return { data: payload.payload };
	}
}
