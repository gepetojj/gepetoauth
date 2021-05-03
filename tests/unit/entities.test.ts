import { RefreshToken } from "../../src/entities/RefreshToken";
import { User } from "../../src/entities/User";

describe("Entities", () => {
	it("should create a RefreshToken entity", () => {
		const refreshToken = new RefreshToken({
			id: "dummyrtid",
			validUntil: 0,
			agent: "dummyrtagent",
			ip: "dummyrtip",
			user: {
				id: "",
				username: "dummyuser",
				email: "dummyemail",
				level: 0,
				avatar: "dummyavatar",
				state: {
					banned: { is: false },
					emailConfirmed: false,
				},
				registerDate: 0,
			},
		});

		expect(refreshToken.id).toBe("dummyrtid");
		expect(refreshToken.agent).toBe("dummyrtagent");
		expect(refreshToken.ip).toBe("dummyrtip");
	});

	it("should create a User entity", () => {
		const user = new User({
			username: "dummyuser",
			email: "dummyemail",
			password: "dummypassword",
			level: 0,
			avatar: "dummyavatar",
			state: {
				banned: { is: false },
				emailConfirmed: false,
			},
			register: {
				date: 0,
				agent: "dummyagent",
				ip: "dummyip",
			},
		});

		expect(user.username).toBe("dummyuser");
	});
});
