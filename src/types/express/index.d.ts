namespace Express {
	export interface Request {
		realIp: string;
		user: {
			id: string;
			name: string;
		};
	}
}
