import { Router, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

import { firestore } from "../../assets/firebase";
import { createId } from "../../assets/tokens";
import { validateSession } from "../../assets/middlewares";
import { AppInfo, AccessToken } from "../../assets/types";
import response, { messages } from "../../assets/response";
import logger from "../../assets/logger";

const router = Router();
const schema: Schema = {
	app_avatar: {
		in: ["body"],
		errorMessage: "O campo 'app_avatar' está inválido.",
		isString: true,
		toLowerCase: true,
		isLowercase: true,
		isURL: {
			errorMessage: "O campo 'app_avatar' deve ser uma URL válida.",
		},
	},
	app_description: {
		in: ["body"],
		errorMessage: "O campo 'app_description' está inválido.",
		isString: true,
		toLowerCase: true,
		isLowercase: true,
		escape: true,
		isLength: {
			errorMessage:
				"O campo 'app_description' deve ter entre 30 e 100 caracteres.",
			options: {
				min: 30,
				max: 100,
			},
		},
	},
	app_name: {
		in: ["body"],
		errorMessage: "O campo 'app_name' está inválido.",
		isString: true,
		toLowerCase: true,
		isLowercase: true,
		escape: true,
		isLength: {
			errorMessage:
				"O campo 'app_name' deve ter entre 3 e 15 caracteres.",
			options: {
				min: 3,
				max: 15,
			},
		},
	},
};

// router.get("/", (req, res) => {});

router.post(
	"/",
	checkSchema(schema),
	validateSession({ level: 5 }),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(
					response(true, "invaliddata", { errors: errors.array() })
				);
		}

		const user: AccessToken["payload"] =
			req.session === undefined || req.session === null
				? ""
				: req.session.user;

		const { app_avatar, app_description, app_name } = req.body;

		const id = createId();
		const appInfo: AppInfo = {
			app: {
				avatar: app_avatar,
				description: app_description,
				name: app_name,
			},
			author: {
				avatar: user.avatar,
				name: user.name,
				support: user.email,
			},
			authorizedDomains: [],
			clientId: id,
			isAppValid: false,
			redirectUrls: [],
		};

		try {
			await firestore.collection("apps").doc(id).create(appInfo);
			return res.json(response(false, "authorized"));
		} catch (err) {
			logger.error(err);
			return res.status(500).json(response(true, "databaseerror"));
		}
	}
);

// router.delete("/", (req, res) => {});

// router.put("/", (req, res) => {});

export default router;
