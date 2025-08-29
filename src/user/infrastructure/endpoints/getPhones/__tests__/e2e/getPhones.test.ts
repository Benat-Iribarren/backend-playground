import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { GET_PHONES_ENDPOINT } from '../../getPhones';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';

describe('getCards e2e', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await initTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return the card list for a valid user (happy path)', async () => {
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

    const dbPhones = [
      {
        phoneNumber: '666666666',
        isPrimary: true,
      },
      {
        phoneNumber: '777777777',
        isPrimary: false,
      },
    ];
    const spy = jest.spyOn(userRepository, 'getPhones').mockResolvedValue(dbPhones);

    const res = await app.inject({
      method: 'GET',
      url: GET_PHONES_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      phones: [
        { phoneNumber: '666666666', isPrimary: true },
        { phoneNumber: '777777777', isPrimary: false },
      ],
    });
    expect(userRepository.getPhones).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });
});
