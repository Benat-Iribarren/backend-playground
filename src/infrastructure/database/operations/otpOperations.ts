import db from '../dbClient';
import { Otp } from '../../../domain/model/otpType';
import { HashCode } from '../../../domain/model/hashCode';
import { OtpRepository } from '../../../domain/model/otpRepository';

export const otpRepository: OtpRepository = {
  saveOtpToDb,
  otpCodeExistsInDb,
  hashCodeExistsInDb,
  getOtpByHash,
  getExpirationDate,
  deleteOtpFromHashCode,
};

async function saveOtpToDb(hash: HashCode, otp: Otp, expirationDateString: string) {
  await db
    .insertInto('otp')
    .values({
      hash,
      otp,
      expirationDate: expirationDateString,
    })
    .execute();
}

async function otpCodeExistsInDb(otp: Otp): Promise<boolean> {
  const otpValueFound = await db
    .selectFrom('otp')
    .selectAll()
    .where('otp', '=', otp)
    .executeTakeFirst();

  return otpValueFound !== undefined && otpValueFound !== null;
}

async function hashCodeExistsInDb(hash: HashCode): Promise<boolean> {
  const HashValueFound = await db
  .selectFrom('otp')
  .selectAll()
  .where('hash', '=', hash)
  .executeTakeFirst();

  return HashValueFound !== undefined && HashValueFound !== null; 
}

async function getOtpByHash(hash: HashCode): Promise<Otp | null> {
  const result = await db
    .selectFrom('otp')
    .select('otp')
    .where('hash', '=', hash)
    .executeTakeFirst();

  return result?.otp ?? null;
}

async function getExpirationDate(hash: HashCode): Promise<string | null> {
  const result = await db
    .selectFrom('otp')
    .select('expirationDate')
    .where('hash', '=', hash)
    .executeTakeFirst();
  return result?.expirationDate ?? null;

}

async function deleteOtpFromHashCode(hash: HashCode) {
  await db
    .deleteFrom('otp')
    .where('hash', '=', hash)
    .execute();
}


