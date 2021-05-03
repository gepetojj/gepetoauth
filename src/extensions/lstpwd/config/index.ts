import dotenv from "dotenv";
dotenv.config();

const config = {
	airtableApiKey: String(process.env.AIRTABLE_API_KEY),
	passwordSalt: String(process.env.PASSWORD_SALT),
};
export default config;
