import { build } from '@common/infrastructure/server/serverBuild';
import { GET_CARDS_ENDPOINT } from '../../getCards';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';
import { cardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';
import { FastifyInstance } from 'fastify';

jest.mock('@auth/infrastructure/database/repositories/SQLiteTokenRepository', () => ({
  tokenRepository: { getUserIdByToken: jest.fn() },
}));
jest.mock('@user/infrastructure/database/repositories/SQLiteCardRepository', () => ({
  cardRepository: { getCardsByUserId: jest.fn() },
}));

describe('getCards integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return the card list when token exists for a valid user', async () => {
    const token = 'valid-token';
    const userId = 1;

    const repoCards = [
      {
        token: 'tok1',
        lastFourDigits: '1111',
        brand: 'VISA',
        expiryMonth: 12,
        expiryYear: 2099,
        isPrimary: true,
      },
      {
        token: 'tok2',
        lastFourDigits: '2222',
        brand: 'MASTERCARD',
        expiryMonth: 1,
        expiryYear: 2030,
        isPrimary: false,
      },
    ];

    const publicCards = [
      { token: 'tok1', lastFourDigits: '1111', brand: 'VISA', expiry: '12/99', isPrimary: true },
      {
        token: 'tok2',
        lastFourDigits: '2222',
        brand: 'MASTERCARD',
        expiry: '01/30',
        isPrimary: false,
      },
    ];

    (tokenRepository.getUserIdByToken as jest.Mock).mockResolvedValue(userId);
    (cardRepository.getCardsByUserId as jest.Mock).mockResolvedValue(repoCards);

    const response = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ cards: publicCards });
    expect(tokenRepository.getUserIdByToken).toHaveBeenCalledWith('valid-token');
    expect(cardRepository.getCardsByUserId).toHaveBeenCalledWith(userId);
  });

  test('should return an empty array if user token exists but user has not cards added', async () => {
    const token = 'valid-token';
    const userId = 1;

    (tokenRepository.getUserIdByToken as jest.Mock).mockResolvedValue(userId);
    (cardRepository.getCardsByUserId as jest.Mock).mockResolvedValue([]);

    const response = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ cards: [] });
    expect(tokenRepository.getUserIdByToken).toHaveBeenCalledWith('valid-token');
    expect(cardRepository.getCardsByUserId).toHaveBeenCalledWith(userId);
  });

  test('should return a unauthorized error when token does not exist', async () => {
    const token = 'not-valid-token';

    (tokenRepository.getUserIdByToken as jest.Mock).mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: 'Unauthorized.' });
    expect(tokenRepository.getUserIdByToken).toHaveBeenCalledWith('not-valid-token');
    expect(cardRepository.getCardsByUserId).not.toHaveBeenCalled();
  });

  test('should return bad request error when token is not introduced', async () => {
    const response = await app.inject({
      method: 'GET',
      url: GET_CARDS_ENDPOINT,
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('Bad Request');
    expect(tokenRepository.getUserIdByToken).not.toHaveBeenCalled();
    expect(cardRepository.getCardsByUserId).not.toHaveBeenCalled();
  });
});
