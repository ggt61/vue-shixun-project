import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function formatDateToTimeStamp(time: any) {
  return +dayjs(time);
}

function formatDateTime(time: any, format: string) {
  return dayjs(time).format(format);
}

export { formatDateToTimeStamp, formatDateTime };
