import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export class DayjsLoader {
	execute() {
		dayjs.extend(utc);
		dayjs.extend(timezone);
		dayjs.tz.setDefault("America/Maceio");
		return dayjs;
	}
}
