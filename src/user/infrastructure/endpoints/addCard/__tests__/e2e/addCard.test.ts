import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { ADD_CARD_ENDPOINT } from '../../addCard';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { cardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';

describe('addCard e2e', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await initTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should add a card for a valid user (happy path)', async () => {
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

    const spy = jest.spyOn(cardRepository, 'addCard').mockResolvedValue({
      userId: 1,
      lastFourDigits: '1111',
      brand: 'VISA',
      expiryMonth: 12,
      expiryYear: 2099,
      token: 'tok_abc',
      isPrimary: false,
    });

    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();

    expect(body.card).toEqual(
      expect.objectContaining({
        lastFourDigits: '1111',
        brand: 'VISA',
        expiry: '12/99',
        isPrimary: false,
      }),
    );
    expect(typeof body.card.token).toBe('string');
    expect(body.card.token.length).toBeGreaterThan(0);

    spy.mockRestore();
  });
});
