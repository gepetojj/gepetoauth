"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressLoader_1 = require("./loaders/ExpressLoader");
const DayjsLoader_1 = require("./loaders/DayjsLoader");
const LoggerLoader_1 = __importDefault(require("./loaders/LoggerLoader"));
const config_1 = __importDefault(require("./config"));
const port = config_1.default.port;
const dayjs = new DayjsLoader_1.DayjsLoader().execute();
const app = new ExpressLoader_1.ExpressLoader().execute();
app.listen(port, "0.0.0.0", () => {
    LoggerLoader_1.default.info(`[${dayjs().format("hh:mm:ssa DD/MM/YYYY")}] (${config_1.default.dev === true ? "dev" : "prod"}) O servidor esta online.`);
});
