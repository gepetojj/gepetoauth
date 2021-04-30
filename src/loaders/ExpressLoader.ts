import express, { Express } from "express";

import { urlencoded, json } from "body-parser";
import compression from "compression";
import cookieSession from "cookie-session";
import cors from "cors";
import enforceSSL from "express-enforces-ssl";
import expressUseragent from "express-useragent";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { router } from "../routes";
import { DayjsLoader } from "./DayjsLoader";
import { hsts, userIp, rateLimiter } from "../middlewares";
import config from "../config";
import logger from "./LoggerLoader";
import response from "../utils/response";

export class ExpressLoader {
	execute(): Express {
		const app = express();
		const dayjs = new DayjsLoader().execute();

		if (!config.dev) {
			app.enable("trust proxy");
			app.use(enforceSSL());
		} else {
			if (!config.test) {
				app.use(pinoHttp({ logger }));
			}
		}
		app.use(
			hsts({
				maxAge: 31536000,
				includeSubDomains: true,
				preload: true,
			})
		);
		app.use(
			helmet({
				hsts: false,
				contentSecurityPolicy: {
					directives: {
						...helmet.contentSecurityPolicy.getDefaultDirectives(),
						"img-src": ["data:", "'self'", "https:"],
					},
				},
			})
		);
		app.use(
			cors({
				origin: "*",
			})
		);
		app.use(compression());
		app.use(userIp());
		app.use(expressUseragent.express());
		app.use(rateLimiter());
		app.use(urlencoded({ extended: false }));
		app.use(json());
		app.use(
			cookieSession({
				secret: config.cookieSecret,
				expires: dayjs().add(1, "day").toDate(),
				secure: !config.dev,
				httpOnly: true,
				signed: true,
				sameSite: "lax",
			})
		);

		app.use("/", router);
		app.use("/static", express.static("src/static"));
		app.use((req, res) => {
			return res.status(404).json(
				response(true, "invalidendpoint", {
					endpoint: req.url,
					method: req.method,
				})
			);
		});

		return app;
	}
}
