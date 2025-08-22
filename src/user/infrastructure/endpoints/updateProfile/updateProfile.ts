import { FastifyInstance } from 'fastify';
import { updateProfileSchema } from './schema';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import {
  updateProfileService,
  successfulStatusMsg,
  userNotFoundErrorStatusMsg,
  emptyPatchErrorStatusMsg,
} from '@user/application/services/updateProfileService';
import { UserProfile } from '@user/domain/model/UserProfile';
import { isValidNin } from '@common/domain/helpers/validators/ninValidator';
import { isValidEmail } from '@user/domain/helpers/emailValidator';

export const UPDATE_PROFILE_ENDPOINT = '/user/profile';

type UpdateProfileBody = Partial<Pick<UserProfile, 'fullName' | 'nin' | 'email'>>;

type UpdateProfileErrors =
  | typeof successfulStatusMsg
  | typeof userNotFoundErrorStatusMsg
  | typeof emptyPatchErrorStatusMsg
  | 'INVALID_PARAMETERS_FORMAT';

const statusToMessage: { [K in UpdateProfileErrors]: string | object } & {
  [key: string]: string | object;
} = {
  [successfulStatusMsg]: { message: 'Profile updated successfully.' },
  [userNotFoundErrorStatusMsg]: { error: 'User not found.' },
  [emptyPatchErrorStatusMsg]: { error: 'Missing profile parameters.' },
  INVALID_PARAMETERS_FORMAT: { error: 'Invalid parameters format.' },
};

type StatusCode = 200 | 400 | 404;

const statusToCode: { [K in UpdateProfileErrors]: StatusCode } & { [key: string]: StatusCode } = {
  [successfulStatusMsg]: 200,
  [userNotFoundErrorStatusMsg]: 404,
  [emptyPatchErrorStatusMsg]: 400,
  INVALID_PARAMETERS_FORMAT: 400,
};

interface UpdateProfileDependencies {
  userRepository: typeof userRepository;
}

function updateProfile(dependencies: UpdateProfileDependencies = { userRepository }) {
  return async function (fastify: FastifyInstance) {
    fastify.put(UPDATE_PROFILE_ENDPOINT, updateProfileSchema, async (request, reply) => {
      try {
        const userId = request.userId!;
        const body = (request.body ?? {}) as UpdateProfileBody;

        if (missingParameters(body)) {
          return reply
            .status(statusToCode[emptyPatchErrorStatusMsg])
            .send(statusToMessage[emptyPatchErrorStatusMsg]);
        }

        if (invalidParameters(body)) {
          return reply
            .status(statusToCode.INVALID_PARAMETERS_FORMAT)
            .send(statusToMessage.INVALID_PARAMETERS_FORMAT);
        }

        const result = await updateProfileService(dependencies.userRepository, {
          userId,
          data: body,
        });

        return reply.status(statusToCode[result]).send(statusToMessage[result]);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
  };
}

function missingParameters(body: UpdateProfileBody): boolean {
  return !body.fullName && !body.nin && !body.email;
}

function invalidParameters(body: UpdateProfileBody): boolean {
  if (
    body.fullName !== undefined &&
    (typeof body.fullName !== 'string' || body.fullName.trim() === '')
  ) {
    return true;
  }
  if (body.nin !== undefined && !isValidNin(body.nin)) {
    return true;
  }
  if (body.email !== undefined && !isValidEmail(body.email)) {
    return true;
  }
  return false;
}

export default updateProfile;
