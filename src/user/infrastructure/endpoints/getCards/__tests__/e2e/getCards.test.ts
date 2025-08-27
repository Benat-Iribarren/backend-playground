import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { GET_CARDS_ENDPOINT } from '../../getCards';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { ADD_CARD_ENDPOINT } from '@user/infrastructure/endpoints/addCard/addCard';

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

  test('should return cards list for valid user (happy path)', async () => {
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

    const addRes = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });
    expect(addRes.statusCode).toBe(201);
    const { card } = addRes.json();

    const getRes = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json()).toEqual({ cards: [card] });
  });
});
