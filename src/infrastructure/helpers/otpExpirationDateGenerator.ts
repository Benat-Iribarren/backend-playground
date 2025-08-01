const fiveMinutesInMilliseconds = 1000 * 60 * 5;
export function obtainOtpExpirationDate(): Date {
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}
