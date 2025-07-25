import { Otp, OtpStorage } from "../domain/model/otpType";
import { HashCode } from "../domain/model/hashCode";

export const otpStorage: OtpStorage = {
  saveOtp,
  otpCodeExists,
  hashCodeExists,
  deleteOtp,
  otpExpired,
  otpMatchesHash,
};

type OtpValue = {
  otp: Otp;
  expirationDate: Date;
};

const Storage = new Map<HashCode, OtpValue>();
export function printStorage() {
  console.log("Current OTP Storage:");
  Storage.forEach((value, key) => {
    console.log(`Hash: ${key}, OTP: ${value.otp}, Expiration Date: ${value.expirationDate}`);
  });
}

function saveOtp(hash: HashCode, otp: Otp) {
  const expirationDate = obtainOtpExpirationDate();
  Storage.set(hash, { otp: otp, expirationDate });
}

const fiveMinutesInMilliseconds = 1000 * 60 * 5;
function obtainOtpExpirationDate(): Date {
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}

function otpCodeExists(otp: Otp): boolean {
  for (const { otp: storedOtp } of Storage.values()) {
    if (storedOtp === otp) return true;
  }
  return false;
}


function hashCodeExists(hash: HashCode): boolean {
  return Storage.has(hash);
}
function otpExpired(hash: HashCode, otp: Otp): boolean {
  return otpMatchesHash(hash, otp) && isOtpInvalid(hash);
}
function isOtpInvalid(hash: HashCode): boolean {
  return !isOtpValid(hash);
}

function isOtpValid(hash: HashCode): boolean {
  const otpValue = Storage.get(hash);
  if (otpNotFound(otpValue)) return false;
  return isExpirationDateValid(otpValue!);
}

function isExpirationDateValid(otpValue: OtpValue): boolean {
  return otpValue.expirationDate !== undefined && otpValue.expirationDate > new Date();
}

function otpNotFound(value: OtpValue | undefined): boolean {
  return value === undefined;
}

function otpMatchesHash(hash: HashCode, otp: Otp): boolean {
  return Storage.has(hash) && Storage.get(hash)?.otp === otp;
}

function deleteOtp(hash: HashCode) {
  Storage.delete(hash);
}
