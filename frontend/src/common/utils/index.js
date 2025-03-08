import moment from "moment";

export function formatDate(date, dateFormat = "DD/MM/YYYY HH:MM") {
  return date ? moment(date).format(dateFormat) : null;
}
