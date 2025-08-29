import { FastifyInstance } from 'fastify';
import { build } from '@src/common/infrastructure/server/serverBuild';
import { UPDATE_PROFILE_ENDPOINT } from '../../updateProfile';
import { userRepository } from '@src/user/infrastructure/database/repositories/SQLiteUserRepository';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';

jest.mock('@auth/infrastructure/database/repositories/SQLiteTokenRepository', () => ({
  tokenRepository: { getUserIdByToken: jest.fn() },
}));
jest.mock('@src/user/infrastructure/database/repositories/SQLiteUserRepository', () => ({
  userRepository: { updateProfile: jest.fn() },
}));

describe('updateProfile integration', () => {
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

  test('should update profile when body is valid and user exists', async () => {
    const token = 'valid-token';
    const userId = 1;
    jest.spyOn(tokenRepository, 'getUserIdByToken').mockResolvedValue(userId);
    jest.spyOn(userRepository, 'updateProfile').mockResolvedValue(true);

    const response = await app.inject({
      method: 'PUT',
      url: UPDATE_PROFILE_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { fullName: 'New Name' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Profile updated successfully.' });
    expect(userRepository.updateProfile).toHaveBeenCalledWith(userId, { fullName: 'New Name' });
  });

  test('should return a user not found error when token exists but user does not', async () => {
    const token = 'valid-token';
    const userId = 1;

    jest.spyOn(tokenRepository, 'getUserIdByToken').mockResolvedValue(userId);
    jest.spyOn(userRepository, 'updateProfile').mockResolvedValue(false);

    const response = await app.inject({
      method: 'PUT',
      url: UPDATE_PROFILE_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { fullName: 'New Name' },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'User not found.' });
  });

  test('should return a unauthorized error when token does not exist', async () => {
    const token = 'not-valid-token';

    jest.spyOn(tokenRepository, 'getUserIdByToken').mockResolvedValue(null);

    const response = await app.inject({
      method: 'PUT',
      url: UPDATE_PROFILE_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: { fullName: 'New Name' },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: 'Unauthorized.' });
  });

  test('should return bad request error when token is not introduced', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: UPDATE_PROFILE_ENDPOINT,
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('Bad Request');
    expect(tokenRepository.getUserIdByToken).not.toHaveBeenCalled();
  });

  test('should return missing profile parameters error when body is empty', async () => {
    const token = 'valid-token';
    const userId = 1;
    jest.spyOn(tokenRepository, 'getUserIdByToken').mockResolvedValue(userId);
    jest.spyOn(userRepository, 'updateProfile').mockResolvedValue(true);
    const response = await app.inject({
      method: 'PUT',
      url: UPDATE_PROFILE_ENDPOINT,
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Missing profile parameters.' });
    expect(userRepository.updateProfile).not.toHaveBeenCalled();
  });
});
