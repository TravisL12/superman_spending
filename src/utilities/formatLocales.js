export function currency(amount) {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
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
