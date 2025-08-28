import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { GET_CARDS_ENDPOINT } from '../../getCards';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { cardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';

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

    const dbCards = [
      {
        userId: 1,
        token: 'tok1',
        lastFourDigits: '1111',
        brand: 'VISA',
        expiryMonth: 12,
        expiryYear: 2099,
        isPrimary: true,
      },
      {
        userId: 1,
        token: 'tok2',
        lastFourDigits: '2222',
        brand: 'MASTERCARD',
        expiryMonth: 1,
        expiryYear: 2030,
        isPrimary: false,
      },
    ];
    const spy = jest.spyOn(cardRepository, 'getCardsByUserId').mockResolvedValue(dbCards);

    const res = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      cards: [
        { token: 'tok1', lastFourDigits: '1111', brand: 'VISA', expiry: '12/99', isPrimary: true },
        {
          token: 'tok2',
          lastFourDigits: '2222',
          brand: 'MASTERCARD',
          expiry: '01/30',
          isPrimary: false,
        },
      ],
    });

    spy.mockRestore();
  });
});
