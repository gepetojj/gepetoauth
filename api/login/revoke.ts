import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

import { firestore } from "../../assets/firebase";
import { validateAppInfo, validateSession } from "../../assets/middlewares";
import { refreshToken, clientId } from "../../assets/validators";
import response from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	refresh_token: refreshToken,
	client_id: clientId,
};

async function checkAndDeleteToken(token: string): Promise<boolean> {
	try {
		const operation = firestore.collection("sessions").doc(token);
		const tokenQuery = await operation.get();
		if (!tokenQuery.exists) {
			return false;
		}
		await operation.delete();
		return true;
	} catch (err) {
		logger.error(err);
		return false;
	}
}

router.get(
	"/",
	checkSchema(schema),
	validateAppInfo({ redirectUrlRequired: false }),
	validateSession({ level: 0 }),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(
				response(true, "invaliddata", {
					errors: errors.array(),
				})
			);
		}

		const token =
			req.session === undefined || req.session === null
				? ""
				: String(req.session.refreshToken);
		const tokenVerification = await checkAndDeleteToken(token);
		if (!tokenVerification) {
			return res.status(400).json(response(true, "invalidrtoken"));
		}

		if (req.session !== undefined && req.session !== null) {
			req.session.accessToken = null;
			req.session.refreshToken = null;
		}
		return res.json(response(false, "tokenrevoked"));
	}
);

export default router;
