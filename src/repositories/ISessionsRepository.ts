import { Code } from "../entities/Code";
import { RefreshToken } from "../entities/RefreshToken";

export interface ISessionsRepository {
	createNewCode(code: Code): Promise<void>;
	findCode(code: string): Promise<Code | null>;
	findCodeBySpec(spec: string, field: string): Promise<Code | null>;
	deleteCode(code: string): Promise<void>;

	createNewRefreshToken(refreshToken: RefreshToken): Promise<void>;
}
