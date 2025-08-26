import { FastifyInstance } from 'fastify';
import { updateProfileSchema } from './schema';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import { updateProfileService } from '@user/application/services/updateProfileService';
import { UserProfile } from '@user/domain/model/UserProfile';
import { isValidEmail } from '@user/domain/helpers/validators/emailValidator';
import {
  UpdateProfileErrors,
  successfulStatusMsg,
  userNotFoundErrorStatusMsg,
  emptyPatchErrorStatusMsg,
  invalidParametersErrorStatusMsg,
} from './errors';

export const UPDATE_PROFILE_ENDPOINT = '/user/profile';

type UpdateProfileBody = Partial<Pick<UserProfile, 'fullName' | 'email'>>;

const statusToMessage: { [K in UpdateProfileErrors]: { error: string } } = {
  [userNotFoundErrorStatusMsg]: { error: 'User not found.' },
  [emptyPatchErrorStatusMsg]: { error: 'Missing profile parameters.' },
  [invalidParametersErrorStatusMsg]: { error: 'Invalid parameters format.' },
};

type StatusCode = 200 | 400 | 404;

const statusToCode: { [K in UpdateProfileErrors | typeof successfulStatusMsg]: StatusCode } = {
  [successfulStatusMsg]: 200,
  [userNotFoundErrorStatusMsg]: 404,
  [emptyPatchErrorStatusMsg]: 400,
  [invalidParametersErrorStatusMsg]: 400,
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
            .status(statusToCode[invalidParametersErrorStatusMsg])
            .send(statusToMessage[invalidParametersErrorStatusMsg]);
        }

        const result = await updateProfileService(dependencies.userRepository, {
          userId,
          data: body,
        });

        if (result === successfulStatusMsg) {
          return reply
            .status(statusToCode[result])
            .send({ message: 'Profile updated successfully.' });
        }

        return reply.status(statusToCode[result]).send(statusToMessage[result]);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
  };
}

function missingParameters(body: UpdateProfileBody): boolean {
  return !body.fullName && !body.email;
}

function invalidParameters(body: UpdateProfileBody): boolean {
  const keys = Object.keys(body);
  if (keys.some((k) => k !== 'fullName' && k !== 'email')) {
    return true;
  }
  if (
    body.fullName !== undefined &&
    (typeof body.fullName !== 'string' || body.fullName.trim() === '')
  ) {
    return true;
  }
  if (body.email !== undefined && !isValidEmail(body.email)) {
    return true;
  }
  return false;
}

export default updateProfile;
