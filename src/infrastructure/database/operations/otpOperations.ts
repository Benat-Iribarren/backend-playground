import db from '../dbClient';
import { Otp } from '../../../domain/model/otpType';
import { Hash } from '../../../domain/model/hashType';
import { OtpRepository } from '../../../domain/interfaces/otpRepository';

export const otpRepository: OtpRepository = {
  saveOtpToDb,
  otpCodeExistsInDb,
  hashCodeExistsInDb,
  getOtpByHash,
  getExpirationDate,
  deleteOtpFromHashCode,
};

async function saveOtpToDb(hash: Hash, otp: Otp, expirationDateString: string) {
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
  const otpValue = await db
    .selectFrom('otp')
    .selectAll()
    .where('otp', '=', otp)
    .executeTakeFirst();

  return exists(otpValue);
}

async function hashCodeExistsInDb(hash: Hash): Promise<boolean> {
  const HashValue = await db
    .selectFrom('otp')
    .selectAll()
    .where('hash', '=', hash)
    .executeTakeFirst();

  return exists(HashValue);
}

async function getOtpByHash(hash: Hash): Promise<Otp | null> {
  const row = await db
    .selectFrom('otp')
    .select('otp')
    .where('hash', '=', hash)
    .executeTakeFirst();

  return row?.otp ?? null;
}

async function getExpirationDate(hash: Hash): Promise<string | null> {
  const row = await db
    .selectFrom('otp')
    .select('expirationDate')
    .where('hash', '=', hash)
    .executeTakeFirst();
  return row?.expirationDate ?? null;
}

async function deleteOtpFromHashCode(hash: Hash) {
  await db.deleteFrom('otp').where('hash', '=', hash).execute();
}

function exists(row: { hash: string; otp: string; expirationDate: string; } | undefined): boolean {
  return row != null;
}
