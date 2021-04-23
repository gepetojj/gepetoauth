import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

import { firestore } from "../../assets/firebase";
import { validateAppInfo } from "../../assets/middlewares";
import { refreshToken, clientId } from "../../assets/validators";
import response from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	refresh_token: refreshToken,
	client_id: clientId,
};

async function verifyToken(refreshToken: string): Promise<boolean> {
	const tokenQuery = await firestore
		.collection("sessions")
		.doc(refreshToken)
		.get();
	if (!tokenQuery.exists) {
		return false;
	}
	const tokenData = tokenQuery.data();
	if (tokenData !== undefined) {
		return true;
	}
	return false;
}

router.get(
	"/",
	checkSchema(schema),
	validateAppInfo({ redirectUrlRequired: false }),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(
				response(true, "invaliddata", {
					errors: errors.array(),
				})
			);
		}

		const token = String(req.query.refreshToken);
	}
);

export default router;
