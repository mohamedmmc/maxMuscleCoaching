/**
 * Time/date helpers.
 *
 * `getFullDate()` is used for server startup logs.
 * `getDate()` is an internal utility that returns a YYYY-MM-DD string.
 */
function getFullDate() {
  const time = new Date();
  return `${getDate()} ${time.getUTCHours()}:${
    time.getMinutes() <= 9 ? `0${time.getMinutes()}` : time.getMinutes()
  }:${
    time.getUTCSeconds() <= 9
      ? `0${time.getUTCSeconds()}`
      : time.getUTCSeconds()
  }`;
  // return `${time.getHours()}:${time.getUTCMinutes()}:${time.getSeconds()`
}
function getDate(num = 0, unit = "days", operator = "+", dateString = "") {
  if (dateString) {
    if (!/\d{4}-\d{2}-\d{2}/.test(dateString)) {
      throw new Error('Invalid date format. Use "YYYY-MM-DD".');
    }
  }

  // Handle operator validation and calculation as before:

  // Use today's date if no dateString is provided:
  const date = dateString ? new Date(dateString) : new Date();

  if (unit === "days") {
    date.setDate(date.getDate() + (operator === "+" ? num : -num));
  } else if (unit === "months") {
    date.setMonth(date.getMonth() + (operator === "+" ? num : -num));
  } else if (unit === "years") {
    date.setFullYear(date.getFullYear() + (operator === "+" ? num : -num));
  } else {
    throw new Error('Invalid unit. Use "days", "months", or "years".');
  }

  const formattedDate = date.toISOString().slice(0, 10);
  return formattedDate;
}
module.exports = {
  getFullDate,
};
