import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { AccessToken } from "../../assets/types";
import { firestore } from "../../assets/firebase";
import { validateAppInfo, validateSession } from "../../assets/middlewares";
import { verifyAccessToken } from "../../assets/tokens";
import { clientId } from "../../assets/validators";
import response, { messages } from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	client_id: clientId,
};
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

async function checkAndGetTokenInfo(
	token: string
): Promise<[boolean, AccessToken?]> {
	try {
		let { valid, payload } = verifyAccessToken(token);
		if (valid) {
			return [valid, payload];
		}
		return [valid];
	} catch (err) {
		logger.error(err);
		return [false];
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
			return res
				.status(400)
				.json(
					response(true, "invaliddata", { errors: errors.array() })
				);
		}

		const data =
			req.session === undefined || req.session === null
				? ""
				: req.session.user;

		return res.json(
			response(false, "validtoken", {
				data,
			})
		);
	}
);

export default router;
