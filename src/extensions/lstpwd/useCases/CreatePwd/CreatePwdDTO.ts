export interface ICreatePwdDTO {
	user: {
		id: string;
		name: string;
	};
	password: {
		service: string;
		icon: string;
		password: string;
	};
}
