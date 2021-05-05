import dotenv from "dotenv";
dotenv.config();

const config = {
	passwordSalt: String(process.env.PASSWORD_SALT),
};
export default config;
