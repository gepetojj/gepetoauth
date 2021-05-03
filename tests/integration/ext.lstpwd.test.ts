import request from "supertest";

import { ExpressLoader } from "../../src/loaders/ExpressLoader";
import { createAccessToken } from "../../src/utils/tokens";
import { DayjsLoader } from "../../src/loaders/DayjsLoader";

const dayjs = new DayjsLoader().execute();

describe("Extension flow: lstpwd", () => {
	const app = new ExpressLoader().execute();

	it("should store a new password in the database", async () => {
		const unsensitiveUserData = {
			id: "",
			username: "gepetojj",
			email: "",
			avatar: "",
			level: 0,
			registerDate: 0,
			state: { banned: { is: false }, emailConfirmed: false },
		};
		const token = createAccessToken(unsensitiveUserData);

		const headers = {
			authorization: `Bearer ${token}`,
		};
		const body = {
			service: "Teste",
			password: "SenhaTeste123",
		};

		const response = await request(app)
			.post("/ext/lstpwd/create")
			.send(body)
			.set(headers);
		expect(response.status).toBe(200);
	});
});

describe("Extension errors: lstpwd", () => {
	const app = new ExpressLoader().execute();

	it("should not store a new password, because of invalid authorization header", async () => {
		const unsensitiveUserData = {
			id: "",
			username: "gepetojj",
			email: "",
			avatar: "",
			level: 0,
			registerDate: 0,
			state: { banned: { is: false }, emailConfirmed: false },
		};
		const token = createAccessToken(unsensitiveUserData);

		const headers = {
			authorization: `${token}`,
		};
		const body = {
			service: "Teste",
			password: "SenhaTeste123",
		};

		const response = await request(app)
			.post("/ext/lstpwd/create")
			.send(body)
			.set(headers);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("stack");
	});

	it("should not store a new password, because of invalid data", async () => {
		const unsensitiveUserData = {
			id: "",
			username: "gepetojj",
			email: "",
			avatar: "",
			level: 0,
			registerDate: 0,
			state: { banned: { is: false }, emailConfirmed: false },
		};
		const token = createAccessToken(unsensitiveUserData);

		const headers = {
			authorization: `Bearer ${token}`,
		};
		const body = {
			service: "",
			password: "",
		};

		const response = await request(app)
			.post("/ext/lstpwd/create")
			.send(body)
			.set(headers);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("stack");
	});
});
