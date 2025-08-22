import { FastifyInstance } from 'fastify';
import {
  getProfileService,
  userNotFoundErrorStatusMsg,
} from '@user/application/services/getProfileService';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import { getProfileSchema } from './schema';

export const GET_PROFILE_ENDPOINT = '/user/profile';

const statusToMessage = {
  [userNotFoundErrorStatusMsg]: { error: 'User not found.' },
} as const;

const statusToCode = {
  SUCCESSFUL: 200,
  [userNotFoundErrorStatusMsg]: 404,
} as const;

export default function registerGetProfile() {
  return async function (fastify: FastifyInstance) {
    fastify.get(GET_PROFILE_ENDPOINT, getProfileSchema, async (request, reply) => {
      try {
        const userId = request.userId!;
        const result = await getProfileService(userRepository, { userId });

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
