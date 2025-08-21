import { FastifyInstance } from 'fastify';
import {
  getProfileService,
  tokenNotFoundErrorStatusMsg,
  userNotFoundErrorStatusMsg,
} from '@user/application/services/getProfileService';
import { tokenReader } from '@auth/infrastructure/database/repositories/SQLiteTokenReader';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import { getProfileSchema } from './schema';
import { extractBearer } from '@user/infrastructure/helpers/extractBearer';

export const GET_PROFILE_ENDPOINT = '/user/profile';

const statusToMessage = {
  [tokenNotFoundErrorStatusMsg]: { error: 'Invalid or missing token.' },
  [userNotFoundErrorStatusMsg]: { error: 'User not found.' },
} as const;

const statusToCode = {
  SUCCESSFUL: 200,
  [tokenNotFoundErrorStatusMsg]: 401,
  [userNotFoundErrorStatusMsg]: 404,
} as const;

export default function registerGetProfile() {
  return async function (fastify: FastifyInstance) {
    fastify.get(GET_PROFILE_ENDPOINT, getProfileSchema, async (request, reply) => {
      try {
        const bearerToken = request.headers['authorization'];
        if (!bearerToken) {
          return reply
            .status(statusToCode[tokenNotFoundErrorStatusMsg])
            .send(statusToMessage[tokenNotFoundErrorStatusMsg]);
        }
        const token = extractBearer(bearerToken);
        if (!token) {
          return reply
            .status(statusToCode[tokenNotFoundErrorStatusMsg])
            .send(statusToMessage[tokenNotFoundErrorStatusMsg]);
        }

        const result = await getProfileService(tokenReader, userRepository, { token });

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
