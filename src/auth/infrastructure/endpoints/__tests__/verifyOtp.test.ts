import { FastifyInstance } from 'fastify';
import { build } from '../../server/serverBuild';
import { createTables } from '../../database/createTables';
import { seedUser } from '../../database/seeders/userSeeder';

import { REQUEST_OTP_ENDPOINT } from '../requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '../verifyOtp/verifyOtp';

/**
 * @group e2e
 */
describe('requestOtp endpoint end-to-end tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    if (process.env.NODE_ENV === 'test') {
      try {
        await createTables();
        await seedUser();
      } catch (error) {
        console.error('Error setting up test database:', error);
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

  test('should return a token when introducing a correct hash and verification code', async () => {
    const nin = '87654321Z';
    const phone = '222222222';

    const requestOtpResponse = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin, phone },
    });

    const { hash, verificationCode } = requestOtpResponse.json();
    expect(requestOtpResponse.statusCode).toBe(201);
    expect(requestOtpResponse.json()).toHaveProperty('hash');
    expect(requestOtpResponse.json()).toHaveProperty('verificationCode');
    expect(hash).not.toBe('');
    expect(verificationCode).not.toBe('');

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
