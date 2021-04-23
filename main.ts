require("dotenv").config();
import express from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import handlebars from "express-handlebars";

import { urlencoded, json } from "body-parser";
import compression from "compression";
import cookieSession from "cookie-session";
import cors from "cors";
import enforceSSL from "express-enforces-ssl";
import expressUseragent from "express-useragent";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { hsts, userIp } from "./assets/middlewares";
import logger from "./assets/logger";
import routes from "./api";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Maceio");

const app = express();
const port = Number(process.env.PORT);
const dev = process.env.NODE_ENV === "development" ? true : false;

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

if (!dev) {
	app.enable("trust proxy");
	app.use(enforceSSL());
}
if (dev) {
	app.use(pinoHttp({ logger }));
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
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
	cookieSession({
		secret: process.env.COOKIE_SECRET,
		expires: dayjs().add(1, "day").toDate(),
		secure: !dev,
		httpOnly: true,
		signed: true,
		sameSite: "lax",
	})
);

app.use("/", routes);
app.use("/static", express.static("static"));
app.use((req, res) => {
	return res.status(404).json({
		error: true,
		message: "Este endpoint com esse método não foi encontrado.",
		method: req.method,
		endpoint: req.path,
	});
});

app.listen(port, "0.0.0.0", () => {
	logger.info(
		`[${dayjs().format("hh:mm:ssa DD/MM/YYYY")}] (${
			dev === true ? "dev" : "prod"
		}) O servidor esta online.`
	);
});
