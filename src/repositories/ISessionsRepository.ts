import { RefreshToken } from "../entities/RefreshToken";

export interface ISessionsRepository {
	createNewRefreshToken(refreshToken: RefreshToken): Promise<void>;
	findRefreshToken(refreshToken: string): Promise<RefreshToken | null>;
	deleteRefreshToken(refreshToken: string): Promise<void>;
}
