import request from "supertest";

import { ExpressLoader } from "../../src/loaders/ExpressLoader";

describe("Register flow", () => {
	const app = new ExpressLoader().execute();
	it("should create a new user", async () => {
		const userPayload = {
			username: "gepetojj",
			email: "nmjoaopedro22@gmail.com",
			password: "JoaoPedro;123",
		};
		const response = await request(app).post("/register").send(userPayload);

		expect(response.status).toBe(201);
	}, 10000);
});

describe("Register flow errors", () => {
	const app = new ExpressLoader().execute();
	it("should not create a new user, because of user already exists", async () => {
		const userPayload = {
			username: "gepetojj",
			email: "nmjoaopedro22@gmail.com",
			password: "JoaoPedro;123",
		};
		const response = await request(app).post("/register").send(userPayload);

		expect(response.status).toBe(500);
	}, 10000);
	
	it("should not create a new user, because of invalid data", async () => {
		const userPayload = {
			username: "aa",
			email: "dummyinvalidemail.com",
			password: "JoaoPedro",
		};
		const response = await request(app).post("/register").send(userPayload);

		expect(response.status).toBe(400);
	}, 10000);
});
