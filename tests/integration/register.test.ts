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
