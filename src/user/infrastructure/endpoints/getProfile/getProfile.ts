import { FastifyInstance } from 'fastify';
import { getProfileService } from '@user/application/services/getProfileService';
import { userRepository as defaultUserRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import { getProfileSchema } from './schema';
import { GetProfileErrors, userNotFoundErrorStatusMsg, unauthorizedErrorStatusMsg } from './errors';

export const GET_PROFILE_ENDPOINT = '/user/profile' as const;

const statusToMessage: {
  [K in Exclude<GetProfileErrors, typeof unauthorizedErrorStatusMsg>]: { error: string };
} = {
  [userNotFoundErrorStatusMsg]: { error: 'User not found.' },
};

type StatusCode = 200 | 401 | 404;

const statusToCode: { [K in GetProfileErrors | 'SUCCESSFUL']: StatusCode } = {
  SUCCESSFUL: 200,
  [userNotFoundErrorStatusMsg]: 404,
  [unauthorizedErrorStatusMsg]: 401,
};

interface Deps {
  userRepository: typeof defaultUserRepository;
}

export default function registerGetProfile(deps: Deps = { userRepository: defaultUserRepository }) {
  return async function (fastify: FastifyInstance) {
    fastify.get(GET_PROFILE_ENDPOINT, getProfileSchema, async (request, reply) => {
      try {
        const userId = request.userId!;
        const result = await getProfileService(deps.userRepository, { userId });
        if (typeof result !== 'object') {
          return reply.status(statusToCode[result]).send(statusToMessage[result]);
        }
        return reply.status(statusToCode.SUCCESSFUL).send(result);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
  };
}
