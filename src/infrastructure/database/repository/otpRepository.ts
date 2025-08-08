import db from '../dbClient';
import { Hash, VerificationCode, Otp } from '../../../domain/model/Otp';
import { OtpRepository } from '../../../domain/interfaces/repositories/otpRepository';
import { UserId } from '../../../domain/model/User';

export const otpRepository: OtpRepository = {
  saveOtp,
  verificationCodeExists,
  hashCodeExists,
  getVerificationCodeByHash,
  getExpirationDate,
  deleteOtpFromHashCode,
  getUserId,
  getOtp,
};

async function saveOtp(userId: UserId, otp: Otp) {
  const existing = await db
    .selectFrom('otp')
    .select('userId')
    .where('userId', '=', userId)
    .executeTakeFirst();

  if (existing) {
    await db
      .updateTable('otp')
      .set({
        hash: otp.hash,
        verificationCode: otp.verificationCode,
        expirationDate: otp.expirationDate,
      })
      .where('userId', '=', userId)
      .execute();
  } else {
    await db
      .insertInto('otp')
      .values({
        userId,
        hash: otp.hash,
        verificationCode: otp.verificationCode,
        expirationDate: otp.expirationDate,
      })
      .execute();
  }
}

async function getOtp(verificationCode: VerificationCode, hash: Hash) {
  const otpRow = await db
    .selectFrom('otp')
    .selectAll()
    .where('verificationCode', '=', verificationCode)
    .where('hash', '=', hash)
    .executeTakeFirst();
  if (!otpRow) {
    return null;
  }
  return {
    userId: otpRow.userId,
    expirationDate: otpRow.expirationDate,
  };
}
async function verificationCodeExists(verificationCode: VerificationCode): Promise<boolean> {
  const otpRow = await db
    .selectFrom('otp')
    .selectAll()
    .where('verificationCode', '=', verificationCode)
    .executeTakeFirst();

  return exists(otpRow);
}

async function hashCodeExists(hash: Hash): Promise<boolean> {
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

async function getUserId(hash: Hash): Promise<number | null> {
  const row = await db
    .selectFrom('otp')
    .select('userId')
    .where('hash', '=', hash)
    .executeTakeFirst();
  return row?.userId ?? null;
}

async function deleteOtpFromHashCode(hash: Hash) {
  await db.deleteFrom('otp').where('hash', '=', hash).execute();
}

function exists(
  row: { hash: Hash; verificationCode: VerificationCode; expirationDate: string } | undefined,
): boolean {
  return row !== null;
}
