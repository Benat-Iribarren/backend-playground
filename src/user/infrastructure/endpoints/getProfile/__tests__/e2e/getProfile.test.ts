import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { GET_PROFILE_ENDPOINT } from '../../getProfile';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';

describe('getProfile e2e', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await initTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return user profile for valid user (happy path)', async () => {
    const nin = '87654321Z';
    const phone = '222222222';

    const requestOtpRes = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin, phone },
    });
    expect(requestOtpRes.statusCode).toBe(201);
    const { hash, verificationCode } = requestOtpRes.json();

    const verifyOtpRes = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash, verificationCode },
    });
    expect(verifyOtpRes.statusCode).toBe(201);
    const { token } = verifyOtpRes.json();

    const profileRes = await app.inject({
      method: 'GET',
      url: GET_PROFILE_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(profileRes.statusCode).toBe(200);
    expect(profileRes.json()).toEqual({
      id: 1,
      fullName: 'Usuario Uno',
      nin: '87654321Z',
      email: 'usuario1@example.com',
    });
  });
});
