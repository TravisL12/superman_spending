import { startCase, toLower } from "lodash";

export function currency(amount, options = {}) {
  const localeOptions = Object.assign(
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    },
    options
  );

  const localeAmount = options.rounded
    ? Math.round(amount / 100)
    : amount / 100;
  return localeAmount.toLocaleString("en-US", localeOptions);
}

function localDateString(date, options) {
  options.timeZone = "UTC";
  return date.toLocaleDateString("en-US", options);
}

export function formatFullDate(
  date,
  options = {
    month: "numeric",
    year: "numeric",
    day: "numeric"
  }
) {
  return localDateString(new Date(date), options);
}

export function formatDate(
  month,
  year,
  options = {
    month: "long",
    year: "numeric"
  }
) {
  return localDateString(new Date(Date.UTC(year, month)), options);
}

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export function titleCase(string = "") {
  return startCase(toLower(string));
}
