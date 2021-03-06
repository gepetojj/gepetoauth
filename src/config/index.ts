import dotenv from "dotenv";
dotenv.config();

const config = {
	dev:
		process.env.NODE_ENV === "development" ||
		process.env.NODE_ENV === "test"
			? true
			: false,
	test: process.env.NODE_ENV === "test" ? true : false,
	port: Number(process.env.PORT),
	srcPath: `${process.cwd()}/src`,

	// Firebase config
	pkid: String(process.env.PKID),
	pk: String(process.env.PK).replace(/\\n/g, "\n"),
	ce: String(process.env.CE),
	cid: String(process.env.CID),
	curl: String(process.env.CURL),

	// Mail providers config
	mailtrapUser: String(process.env.MAILTRAP_USER),
	mailtrapPass: String(process.env.MAILTRAP_PASS),
	mailgunUser: String(process.env.MAILGUN_USER),
	mailgunPass: String(process.env.MAILGUN_PASS),

	cookieSecret: String(process.env.COOKIE_SECRET),
	accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET),

	// Redis
	redisServer: String(process.env.REDIS_SERVER),
	redisPort: Number(process.env.REDIS_PORT),
	redisPass: String(process.env.REDIS_PASS),
};
export default config;
