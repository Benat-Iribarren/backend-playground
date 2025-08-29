import { build } from '@common/infrastructure/server/serverBuild';
import { GET_PHONES_ENDPOINT } from '../../getPhones';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import { FastifyInstance } from 'fastify';

jest.mock('@auth/infrastructure/database/repositories/SQLiteTokenRepository', () => ({
  tokenRepository: { getUserIdByToken: jest.fn() },
}));
jest.mock('@user/infrastructure/database/repositories/SQLiteUserRepository', () => ({
  userRepository: { getPhones: jest.fn() },
}));

describe('getPhones integration', () => {
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

  test('should return the phone list when token exists for a valid user', async () => {
    const token = 'valid-token';
    const userId = 1;

    const repoPhones = [
      {
        phoneNumber: '1234567890',
        isPrimary: true,
      },
      {
        phoneNumber: '0987654321',
        isPrimary: false,
      },
    ];

    const publicPhones = [
      {
        phoneNumber: '1234567890',
        isPrimary: true,
      },
      {
        phoneNumber: '0987654321',
        isPrimary: false,
      },
    ];

    (tokenRepository.getUserIdByToken as jest.Mock).mockResolvedValue(userId);
    (userRepository.getPhones as jest.Mock).mockResolvedValue(repoPhones);

    const response = await app.inject({
      method: 'GET',
      url: GET_PHONES_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ phones: publicPhones });
    expect(tokenRepository.getUserIdByToken).toHaveBeenCalledWith('valid-token');
    expect(userRepository.getPhones).toHaveBeenCalledWith(userId);
  });

  test('should return an empty array if user token exists but user has not phones added', async () => {
    const token = 'valid-token';
    const userId = 1;

    (tokenRepository.getUserIdByToken as jest.Mock).mockResolvedValue(userId);
    (userRepository.getPhones as jest.Mock).mockResolvedValue([]);

    const response = await app.inject({
      method: 'GET',
      url: GET_PHONES_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ phones: [] });
    expect(tokenRepository.getUserIdByToken).toHaveBeenCalledWith('valid-token');
    expect(userRepository.getPhones).toHaveBeenCalledWith(userId);
  });

  test('should return a unauthorized error when token does not exist', async () => {
    const token = 'not-valid-token';

    (tokenRepository.getUserIdByToken as jest.Mock).mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: GET_PHONES_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: 'Unauthorized.' });
    expect(tokenRepository.getUserIdByToken).toHaveBeenCalledWith('not-valid-token');
    expect(userRepository.getPhones).not.toHaveBeenCalled();
  });

  test('should return bad request error when token is not introduced', async () => {
    const response = await app.inject({
      method: 'GET',
      url: GET_PHONES_ENDPOINT,
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('Bad Request');
    expect(tokenRepository.getUserIdByToken).not.toHaveBeenCalled();
    expect(userRepository.getPhones).not.toHaveBeenCalled();
  });
});
