import { FastifyInstance } from 'fastify';
import { build } from '@src/common/infrastructure/server/serverBuild';
import { GET_PROFILE_ENDPOINT } from '../../getProfile';
import { tokenReader } from '@auth/infrastructure/database/repositories/SQLiteTokenReader';
import { userRepository } from '@src/user/infrastructure/database/repositories/SQLiteUserRepository';

jest.mock('@auth/infrastructure/database/repositories/SQLiteTokenReader', () => ({
  tokenReader: { getUserIdByToken: jest.fn() },
}));
jest.mock('@src/user/infrastructure/database/repositories/SQLiteUserRepository', () => ({
  userRepository: { getProfile: jest.fn() },
}));

describe('getProfile', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return the user profile when token exists for a valid user', async () => {
    const token = 'valid-token';
    const userId = 1;
    const profile = {
      id: userId,
      fullName: 'Usuario Uno',
      nin: '87654321Z',
      email: 'usuario.uno@example.com',
    };

    jest.spyOn(tokenReader, 'getUserIdByToken').mockResolvedValue(userId);
    jest.spyOn(userRepository, 'getProfile').mockResolvedValue(profile as any);

    const response = await app.inject({
      method: 'GET',
      url: GET_PROFILE_ENDPOINT,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(profile);
  });

  test('should return a user not found error when token exists but user does not', async () => {
    const token = 'valid-token';
    const userId = 1;

    jest.spyOn(tokenReader, 'getUserIdByToken').mockResolvedValue(userId);
    jest.spyOn(userRepository, 'getProfile').mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: GET_PROFILE_ENDPOINT,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'User not found.' });
  });

  test('should return a unauthorized error when token does not exists', async () => {
    const token = 'not-valid-token';

    jest.spyOn(tokenReader, 'getUserIdByToken').mockResolvedValue(null);
    jest.spyOn(userRepository, 'getProfile').mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: GET_PROFILE_ENDPOINT,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: 'Unauthorized.' });
  });

  test('should return bad request error when token is not introduced', async () => {
    const response = await app.inject({
      method: 'GET',
      url: GET_PROFILE_ENDPOINT,
    });
    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('Bad Request');
  });
});
