import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { ADD_CARD_ENDPOINT } from '@user/infrastructure/endpoints/addCard/addCard';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { DELETE_CARD_ENDPOINT } from '../../deleteCard';
import { GET_CARDS_ENDPOINT } from '@user/infrastructure/endpoints/getCards/getCards';

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

    const addCardRes = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });
    expect(addCardRes.statusCode).toBe(201);

    const getCardsBeforeDeleteRes = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(getCardsBeforeDeleteRes.statusCode).toBe(200);
    const { cards } = getCardsBeforeDeleteRes.json();

    expect(cards.length).toBeGreaterThanOrEqual(1);
    const { token: cardToken } = cards[0];

    const deleteCardRes = await app.inject({
      method: 'DELETE',
      url: DELETE_CARD_ENDPOINT.replace(':cardToken', cardToken),
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deleteCardRes.statusCode).toBe(204);
    expect(deleteCardRes.body).toBe('');

    const getCardsAfterDeleteRes = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(getCardsAfterDeleteRes.statusCode).toBe(200);
    const afterJson = getCardsAfterDeleteRes.json();
    expect(Array.isArray(afterJson.cards)).toBe(true);
    expect(afterJson.cards.find((c: any) => c.token === cardToken)).toBeUndefined();
  });
});
