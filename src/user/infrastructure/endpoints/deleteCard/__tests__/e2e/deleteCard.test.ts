import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { initTestDatabase } from '@common/infrastructure/database/initTestDatabase';
import { ADD_CARD_ENDPOINT } from '@user/infrastructure/endpoints/addCard/addCard';
import { REQUEST_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import { VERIFY_OTP_ENDPOINT } from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { DELETE_CARD_ENDPOINT } from '../../deleteCard';
import { cardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';

describe('deleteCard e2e', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    await initTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should delete a card for a valid user (happy path)', async () => {
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

    const createdToken = 'tok_abc';
    const addSpy = jest.spyOn(cardRepository, 'addCard').mockResolvedValue({
      userId: 1,
      lastFourDigits: '1111',
      brand: 'VISA',
      expiryMonth: 12,
      expiryYear: 2099,
      token: createdToken,
      isPrimary: false,
    });

    const addRes = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });
    expect(addRes.statusCode).toBe(201);
    addSpy.mockRestore();

    const deleteSpy = jest.spyOn(cardRepository, 'deleteCardByTokenAndUserId').mockResolvedValue();

    const deleteRes = await app.inject({
      method: 'DELETE',
      url: DELETE_CARD_ENDPOINT.replace(':cardToken', createdToken),
      headers: { authorization: `Bearer ${token}` },
    });

    expect(deleteRes.statusCode).toBe(204);
    expect(deleteRes.body).toBe('');

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    const [calledUserId, calledToken] = deleteSpy.mock.calls[0];
    expect(typeof calledUserId).toBe('number');
    expect(calledToken).toBe(createdToken);

    deleteSpy.mockRestore();
  });
});
