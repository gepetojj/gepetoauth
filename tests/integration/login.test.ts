import request from "supertest";

import { ExpressLoader } from "../../src/loaders/ExpressLoader";
import { FirebaseSessionsRepository } from "../../src/repositories/implementations/FirebaseSessionsRepository";
import { createRefreshToken } from "../../src/utils/tokens";
import { DayjsLoader } from "../../src/loaders/DayjsLoader";

const dayjs = new DayjsLoader().execute();

describe("Login flow", () => {
	const app = new ExpressLoader().execute();
	let accessToken = "";
	let refreshToken = "";

	it("should authenticate user, with authorized code and valid data", async () => {
		const userPayload = {
			username: "gepetojj",
			password: "JoaoPedro;123",
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("accessToken");
		expect(response.body).toHaveProperty("refreshToken");
		accessToken = response.body.accessToken;
		refreshToken = response.body.refreshToken;
	});

	it("should get user data from accessToken", async () => {
		const queryPayload = {
			access_token: accessToken,
		};

		const response = await request(app)
			.get("/login/verify")
			.query(queryPayload);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("data");
	});

	it("should create a new accessToken, from user refreshToken", async () => {
		const queryPayload = {
			refresh_token: refreshToken,
		};

		const response = await request(app)
			.get("/login/refresh")
			.query(queryPayload);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("accessToken");
	});
});

describe("Login flow errors", () => {
	const app = new ExpressLoader().execute();

	it("should not authenticate, because of invalid username", async () => {
		const userPayload = {
			username: "gepeto",
			password: "JoaoPedro;123",
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload);

		expect(response.status).toBe(500);
	});

	it("should not authenticate, because of invalid password", async () => {
		const userPayload = {
			username: "gepetojj",
			password: "JoaoPedro;321",
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload);

		expect(response.status).toBe(500);
	});

	it("should not authenticate, because of invalid data", async () => {
		const userPayload = {
			username: "inv",
			password: "inv",
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload);

		expect(response.status).toBe(400);
	});

	it("should not get user data, because of invalid accessToken", async () => {
		const queryPayload = {
			access_token: "invaliddummyaccesstoken",
		};

		const response = await request(app)
			.get("/login/verify")
			.query(queryPayload);

		expect(response.status).toBe(400);
	});

	it("should not create a new accessToken, because of invalid refreshToken", async () => {
		const queryPayload = {
			refresh_token: "invaliddummyrefreshtoken",
		};

		const response = await request(app)
			.get("/login/refresh")
			.query(queryPayload);

		expect(response.status).toBe(400);
	});

	it("should not create a new accessToken, because of expired refreshToken", async () => {
		const firebaseSessionsRepository = new FirebaseSessionsRepository();
		const refreshTokenId = createRefreshToken();
		const unsensitiveUserData = {
			id: "",
			username: "",
			email: "",
			avatar: "",
			level: 0,
			registerDate: 0,
			state: { banned: { is: false }, emailConfirmed: false },
		};
		await firebaseSessionsRepository.createNewRefreshToken({
			id: refreshTokenId,
			validUntil: dayjs().subtract(15, "minutes").valueOf(),
			agent: "unknown unknown unknown unknown ",
			ip: "::ffff:127.0.0.1",
			user: unsensitiveUserData,
		});
		const queryPayload = {
			refresh_token: refreshTokenId,
		};

		const response = await request(app)
			.get("/login/refresh")
			.query(queryPayload);

		expect(response.status).toBe(500);
	});
});
