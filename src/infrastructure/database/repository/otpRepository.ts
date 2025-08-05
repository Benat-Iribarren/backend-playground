import db from '../dbClient';
import { Hash, VerificationCode, Otp } from '../../../domain/model/otpType';
import { OtpRepository } from '../../../domain/interfaces/otpRepository';

export const otpRepository: OtpRepository = {
  saveOtpToDb,
  verificationCodeExistsInDb,
  hashCodeExistsInDb,
  getVerificationCodeByHash,
  getExpirationDate,
  deleteOtpFromHashCode,
};

async function saveOtpToDb(
  otp: Otp,
  expirationDateString: string,
) {
  await db
    .insertInto('otp')
    .values({
      hash: otp.hash,
      verificationCode: otp.verificationCode,
      expirationDate: expirationDateString,
    })
    .execute();
}

async function verificationCodeExistsInDb(verificationCode: VerificationCode): Promise<boolean> {
  const otpRow = await db
    .selectFrom('otp')
    .selectAll()
    .where('verificationCode', '=', verificationCode)
    .executeTakeFirst();

  return exists(otpRow);
}

async function hashCodeExistsInDb(hash: Hash): Promise<boolean> {
  const hashRow = await db
    .selectFrom('otp')
    .selectAll()
    .where('hash', '=', hash)
    .executeTakeFirst();

  return exists(hashRow);
}

async function getVerificationCodeByHash(hash: Hash): Promise<VerificationCode | null> {
  const row = await db
    .selectFrom('otp')
    .select('verificationCode')
    .where('hash', '=', hash)
    .executeTakeFirst();

  return row?.verificationCode ?? null;
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

function exists(
  row: { hash: Hash; verificationCode: VerificationCode; expirationDate: string } | undefined,
): boolean {
  return row != null;
}
