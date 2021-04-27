import { Code } from "../../src/entities/Code";
import { RefreshToken } from "../../src/entities/RefreshToken";
import { User } from "../../src/entities/User";

describe("Entities", () => {
	it("should create a Code entity", () => {
		const code = new Code({
			id: "dummycodeid",
			validUntil: 0,
			agent: "dummycodeagent",
			ip: "dummycodeip",
		});

		expect(code.id).toBe("dummycodeid");
		expect(code.agent).toBe("dummycodeagent");
		expect(code.ip).toBe("dummycodeip");
	});

	it("should create a RefreshToken entity", () => {
		const refreshToken = new RefreshToken({
			id: "dummyrtid",
			validUntil: 0,
			agent: "dummyrtagent",
			ip: "dummyrtip",
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
