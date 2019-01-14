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

export function formatFullDate(
  date,
  options = {
    month: "numeric",
    year: "numeric",
    day: "numeric"
  }
) {
  options.timeZone = "UTC";
  const utcDate = new Date(date);
  return utcDate.toLocaleDateString("en-US", options);
}

export function formatDate(
  month,
  year,
  options = {
    month: "long",
    year: "numeric"
  }
) {
  options.timeZone = "UTC";
  const date = new Date(Date.UTC(year, month));
  return date.toLocaleDateString("en-US", options);
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
