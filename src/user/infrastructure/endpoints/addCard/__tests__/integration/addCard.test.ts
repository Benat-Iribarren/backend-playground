import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { ADD_CARD_ENDPOINT } from '../../addCard';

jest.mock('@auth/infrastructure/database/repositories/SQLiteTokenRepository', () => ({
  tokenRepository: {
    getUserIdByToken: jest.fn((t: string) => (t === 'valid-token' ? 1 : null)),
  },
}));

jest.mock('@user/infrastructure/database/repositories/SQLiteCardRepository', () => ({
  cardRepository: { addCard: jest.fn() },
}));

describe('POST /user/card (integration)', () => {
  let app: FastifyInstance;
  const {
    cardRepository,
  } = require('@user/infrastructure/database/repositories/SQLiteCardRepository');

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return success message and card data for valid user token and payload', async () => {
    cardRepository.addCard.mockResolvedValue({
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
      headers: { authorization: 'Bearer valid-token' },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({
      message: 'Card added successfully.',
      card: {
        token: 'tok_abc',
        lastFourDigits: '1111',
        brand: 'VISA',
        expiry: '12/99',
        primary: false,
      },
    });

    expect(cardRepository.addCard).toHaveBeenCalledTimes(1);
    const saved = cardRepository.addCard.mock.calls[0][0];
    expect(saved).toMatchObject({
      userId: 1,
      lastFourDigits: '1111',
      brand: 'VISA',
      expiryMonth: 12,
      expiryYear: 2099,
      isPrimary: false,
    });
    expect(saved).not.toHaveProperty('cardNumber');
  });

  it('should return unauthorized error given an user authorization invalid token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: 'Bearer invalid-token' },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('should return missing parameter error for missing card number', async () => {
    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: 'Bearer valid-token' },
      payload: { expiry: '12/99' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('should return missing parameter error for missing expiry', async () => {
    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: 'Bearer valid-token' },
      payload: { cardNumber: '4111111111111111' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('should return invalid error for not valid card number format', async () => {
    const invalid_card_number = '41111111';
    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: 'Bearer valid-token' },
      payload: { cardNumber: invalid_card_number, expiry: '12/99' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('should return invalid error for not valid card expiry format', async () => {
    const invalid_expiry = '1299';
    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: 'Bearer valid-token' },
      payload: { cardNumber: '4111111111111111', expiry: invalid_expiry },
    });
    expect(res.statusCode).toBe(400);
  });

  it('should return 500 when repository returns null', async () => {
    cardRepository.addCard.mockResolvedValue(null);

    const res = await app.inject({
      method: 'POST',
      url: ADD_CARD_ENDPOINT,
      headers: { authorization: 'Bearer valid-token' },
      payload: { cardNumber: '4111111111111111', expiry: '12/99' },
    });

    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: 'Internal Server Error' });
  });
});
