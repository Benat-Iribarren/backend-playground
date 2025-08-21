import { FastifyInstance } from 'fastify';
import { build } from '../../../../common/infrastructure/server/serverBuild';
import { generateOtpExpirationDate, isOtpExpired } from '../Otp';

describe('Otp', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return a five minute expiration date when generating an otp expiration date', () => {
    const fiveMinutesInMilliseconds = 1000 * 60 * 5;

    const result = generateOtpExpirationDate();

    const expectedDate = new Date(fiveMinutesInMilliseconds).toISOString();
    expect(result).toBe(expectedDate);
  });

  test('should return false when checking if an otp whose expiration date is in the future is expired', () => {
    const fiveMinutesInMilliseconds = 1000 * 60 * 5;
    const otp = {
      userId: 1,
      verificationCode: '123456',
      hash: 'hash',
      expirationDate: new Date(fiveMinutesInMilliseconds).toISOString(),
    };

    jest.advanceTimersByTime(1000);
    const result = isOtpExpired(otp);
    expect(result).toBe(false);
  });

  test('should return true when checking if an otp whose expiration date is in the past is expired', () => {
    const fiveMinutesInMilliseconds = 1000 * 60 * 5;
    const otp = {
      userId: 1,
      verificationCode: '123456',
      hash: 'hash',
      expirationDate: new Date(0).toISOString(),
    };

    jest.advanceTimersByTime(fiveMinutesInMilliseconds);
    const result = isOtpExpired(otp);
    expect(result).toBe(true);
  });

  test('should return true when checking if an otp whose expiration date is not a date is expired', () => {
    const fiveMinutesInMilliseconds = 1000 * 60 * 5;
    const otp = {
      userId: 1,
      verificationCode: '123456',
      hash: 'hash',
      expirationDate: 'notADate',
    };

    jest.advanceTimersByTime(fiveMinutesInMilliseconds);
    const result = isOtpExpired(otp);
    expect(result).toBe(true);
  });
});
