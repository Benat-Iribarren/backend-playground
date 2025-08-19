import { FastifyInstance } from 'fastify';
import { build } from '../../../../server/serverBuild';
import { VERIFY_OTP_ENDPOINT } from '../../verifyOtp';
import { createTables } from '../../../../database/createTables';
import { seedUser } from '../../../../database/seeders/userSeeder';
import {
  ExpirationDate,
  generateOtpExpirationDate,
  Hash,
  Otp,
  VerificationCode,
} from '../../../../../domain/model/Otp';
import { codeGenerator } from '../../../../helpers/generators/randomCodeGenerator';
import { hashGenerator } from '../../../../helpers/generators/randomHashGenerator';
import { otpRepository } from '../../../../database/repositories/SQLiteOtpRepository';

jest.mock('../../../../../domain/model/Otp', () => ({
  ...jest.requireActual('../../../../../domain/model/Otp'),
  isOtpExpired: jest.fn(() => false),
}));

describe('verifyOtp', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    if (process.env.NODE_ENV === 'test') {
      try {
        await createTables();
        await seedUser();
      } catch (error) {
        throw error;
      }
    }
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return a token when introducing a correct nin and phone number', async () => {
    const hash: Hash = hashGenerator.generateHash();
    const verificationCode: VerificationCode = codeGenerator.generateSixDigitCode();
    const expirationDateString: ExpirationDate = generateOtpExpirationDate();
    const otp: Otp = {
      userId: 1,
      verificationCode: verificationCode,
      hash: hash,
      expirationDate: expirationDateString,
    };

    await otpRepository.saveOtp(otp);

    const verifyOtpResponse = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash, verificationCode },
    });

    expect(verifyOtpResponse.statusCode).toBe(201);
    expect(verifyOtpResponse.json()).toHaveProperty('token');
    expect(verifyOtpResponse.json().token).not.toBe('');
  });
});
