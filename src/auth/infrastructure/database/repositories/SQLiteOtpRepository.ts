import db from '../dbClient';
import { Hash, VerificationCode, Otp } from '../../../domain/model/Otp';
import { OtpRepository } from '../../../domain/interfaces/repositories/OtpRepository';
import { UserId } from '../../../domain/model/User';

export const otpRepository: OtpRepository = {
  saveOtp,
  getOtp,
  deleteOtp,
};

async function saveOtp(otp: Otp) {
  const existing = await db
    .selectFrom('otp')
    .select('userId')
    .where('userId', '=', otp.userId)
    .executeTakeFirst();

  if (existing) {
    await db
      .updateTable('otp')
      .set({
        hash: otp.hash,
        verificationCode: otp.verificationCode,
        expirationDate: otp.expirationDate,
      })
      .where('userId', '=', otp.userId)
      .execute();
  } else {
    await db
      .insertInto('otp')
      .values({
        userId: otp.userId,
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
  return otpRow;
}
async function deleteOtp(userId: UserId) {
  await db.deleteFrom('otp').where('userId', '=', userId).execute();
}
