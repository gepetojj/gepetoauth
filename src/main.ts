import { ExpressLoader } from "./loaders/ExpressLoader";
import { DayjsLoader } from "./loaders/DayjsLoader";
import logger from "./loaders/LoggerLoader";
import config from "./config";

const port = config.port;
const dayjs = new DayjsLoader().execute();

const app = new ExpressLoader().execute();

app.listen(port, "0.0.0.0", () => {
	logger.info(
		`[${dayjs().format("hh:mm:ssa DD/MM/YYYY")}] (${
			config.dev === true ? "dev" : "prod"
		}) O servidor esta online.`
	);
});
