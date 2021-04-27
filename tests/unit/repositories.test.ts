import { FirebaseSessionsRepository } from "../../src/repositories/implementations/FirebaseSessionsRepository";

describe("Repositories errors", () => {
	it("should not find code, because of inexistence", async () => {
		const firebaseSessionsRepository = new FirebaseSessionsRepository();

		try {
			await firebaseSessionsRepository.findCode("inexistentcode");
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});

	it("should not find code by spec, because of inexistence", async () => {
		const firebaseSessionsRepository = new FirebaseSessionsRepository();

		try {
			await firebaseSessionsRepository.findCodeBySpec(
				"id",
				"inexistentcodeid"
			);
		} catch (err) {
			expect(err).not.toBeNull();
		}
	});
});
