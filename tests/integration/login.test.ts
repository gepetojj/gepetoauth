import request from "supertest";

import { ExpressLoader } from "../../src/loaders/ExpressLoader";
import { FirebaseSessionsRepository } from "../../src/repositories/implementations/FirebaseSessionsRepository";
import { createRefreshToken } from "../../src/utils/tokens";
import { DayjsLoader } from "../../src/loaders/DayjsLoader";

const dayjs = new DayjsLoader().execute();

describe("Login flow", () => {
	const app = new ExpressLoader().execute();
	let code = "";
	it("should authorize next request, by recieving a 32-digit code", async () => {
		const response = await request(app).get("/login/authorize").send();

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("code");
		code = response.body.code;
	});

	it("should authenticate user, with authorized code and valid data", async () => {
		const userPayload = {
			username: "gepetojj",
			password: "JoaoPedro;123",
		};
		const codePayload = {
			code,
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload)
			.query(codePayload);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("accessToken");
		expect(response.body).toHaveProperty("refreshToken");
	});
});

describe("Login flow errors", () => {
	const app = new ExpressLoader().execute();
	it("should not authenticate, because of invalid code", async () => {
		const userPayload = {
			username: "gepetojj",
			password: "JoaoPedro;123",
		};
		const codePayload = {
			code: "",
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload)
			.query(codePayload);

		expect(response.status).toBe(400);
	});

	it("should not authenticate, because of expired code", async () => {
		const firebaseSessionsRepository = new FirebaseSessionsRepository();
		const codeId = createRefreshToken();
		await firebaseSessionsRepository.createNewCode({
			id: codeId,
			validUntil: dayjs().subtract(15, "minutes").valueOf(),
			agent: "unknown unknown unknown unknown ",
			ip: "::ffff:127.0.0.1",
		});

		const userPayload = {
			username: "gepetojj",
			password: "JoaoPedro;123",
		};
		const codePayload = {
			code: codeId,
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload)
			.query(codePayload);

		expect(response.status).toBe(500);
	});

	it("should not authenticate, because of invalid username", async () => {
		const firebaseSessionsRepository = new FirebaseSessionsRepository();
		const codeId = createRefreshToken();
		await firebaseSessionsRepository.createNewCode({
			id: codeId,
			validUntil: dayjs().add(15, "minutes").valueOf(),
			agent: "unknown unknown unknown unknown ",
			ip: "::ffff:127.0.0.1",
		});

		const userPayload = {
			username: "gepeto",
			password: "JoaoPedro;123",
		};
		const codePayload = {
			code: codeId,
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload)
			.query(codePayload);

		expect(response.status).toBe(500);
	});

	it("should not authenticate, because of invalid password", async () => {
		const firebaseSessionsRepository = new FirebaseSessionsRepository();
		const codeId = createRefreshToken();
		await firebaseSessionsRepository.createNewCode({
			id: codeId,
			validUntil: dayjs().add(15, "minutes").valueOf(),
			agent: "unknown unknown unknown unknown ",
			ip: "::ffff:127.0.0.1",
		});

		const userPayload = {
			username: "gepetojj",
			password: "JoaoPedro;321",
		};
		const codePayload = {
			code: codeId,
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload)
			.query(codePayload);

		expect(response.status).toBe(500);
	});

	it("should not authenticate, because of invalid data", async () => {
		const userPayload = {
			username: "inv",
			password: "inv",
		};
		const codePayload = {
			code: "0000",
		};

		const response = await request(app)
			.post("/login/authenticate")
			.send(userPayload)
			.query(codePayload);

		expect(response.status).toBe(400);
	});
});
