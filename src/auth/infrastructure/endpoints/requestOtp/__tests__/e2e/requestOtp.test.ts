import { FastifyInstance } from 'fastify';
import { build } from '../../../../../../common/infrastructure/server/serverBuild';
import { initTestDatabase } from '../../../../../../common/infrastructure/database/initTestDatabase';
import { REQUEST_OTP_ENDPOINT } from '../../requestOtp';

describe('requestOtp', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
    try {
      await initTestDatabase();
    } catch (error) {
      console.error('Error setting up test database:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return hash and verification code for correct nin and phone', async () => {
    const nin = '87654321Z';
    const phone = '222222222';

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin, phone },
    });

    expect(response.statusCode).toBe(201);

    const data = response.json();
    expect(data).toEqual(
      expect.objectContaining({
        verificationCode: expect.any(String),
        hash: expect.any(String),
      }),
    );
  });
});
