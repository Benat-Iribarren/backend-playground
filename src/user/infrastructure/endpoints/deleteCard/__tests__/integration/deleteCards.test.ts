import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { DELETE_CARD_ENDPOINT } from '../../deleteCard';

jest.mock('@auth/infrastructure/database/repositories/SQLiteTokenRepository', () => ({
  tokenRepository: {
    getUserIdByToken: jest.fn((t: string) => (t === 'valid-token' ? 1 : null)),
  },
}));

jest.mock('@user/infrastructure/database/repositories/SQLiteCardRepository', () => ({
  cardRepository: { deleteCardByTokenAndUserId: jest.fn().mockResolvedValue(undefined) },
}));

describe('deleteCard integration', () => {
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

  it('should delete the card and return 204 with empty content for a valid auth token and card token', async () => {
    const authToken = 'valid-token';
    const cardToken = 'tok_abc';

    const res = await app.inject({
      method: 'DELETE',
      url: DELETE_CARD_ENDPOINT.replace(':cardToken', cardToken),
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(res.statusCode).toBe(204);
    expect(res.body).toBe('');

    expect(cardRepository.deleteCardByTokenAndUserId).toHaveBeenCalledTimes(1);
    expect(cardRepository.deleteCardByTokenAndUserId).toHaveBeenCalledWith(1, cardToken);
  });

  it('should return Unauthorized error for invalid auth token', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: DELETE_CARD_ENDPOINT.replace(':cardToken', 'tok_abc'),
      headers: { authorization: 'Bearer invalid-token' },
    });

    expect(res.statusCode).toBe(401);
    expect(cardRepository.deleteCardByTokenAndUserId).not.toHaveBeenCalled();
  });

  it('should return Bad Request error when authorization header is missing', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: DELETE_CARD_ENDPOINT.replace(':cardToken', 'tok_abc'),
    });

    expect(res.statusCode).toBe(400);
    expect(cardRepository.deleteCardByTokenAndUserId).not.toHaveBeenCalled();
  });
});
