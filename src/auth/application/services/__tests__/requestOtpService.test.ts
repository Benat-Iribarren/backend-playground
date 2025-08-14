import { FastifyInstance } from 'fastify';
import { build } from '../../../infrastructure/server/serverBuild';
import { processOtpRequest } from '../requestOtpService';
import { otpRepository } from '../../../infrastructure/database/repository/SQLiteOtpRepository';
import { codeGenerator } from '../../../infrastructure/helpers/generators/randomCodeGenerator';
import { hashGenerator } from '../../../infrastructure/helpers/generators/randomHashGenerator';
import { phoneValidator } from '../../../infrastructure/helpers/validators/blacklistPhoneValidator';
import { UserRepository } from '../../../domain/interfaces/repositories/UserRespository';
import { userNotFoundErrorStatusMsg } from '../../../domain/errors/userLoginErrors';

describe('requestOtp endpoint', () => {
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

  test('should return a user not found error status message when the user does not exist', () => {
    const nin = 'nonExistingNin';
    const phone = 'nonExistingPhone';
    const mockUserRepository = {
      getUser: jest.fn(async () => null),
    } as UserRepository;

    const serviceResponse = processOtpRequest(
      otpRepository,
      { ...mockUserRepository },
      codeGenerator,
      hashGenerator,
      phoneValidator,
      nin,
      phone,
    );

    expect(serviceResponse).resolves.toEqual(userNotFoundErrorStatusMsg);
  });
});
