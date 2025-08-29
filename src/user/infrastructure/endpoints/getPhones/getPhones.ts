import { FastifyInstance } from 'fastify';
import { processGetPhones } from '@user/application/services/getPhonesService';
import { phoneRepository as defaultPhoneRepository } from '@user/infrastructure/database/repositories/SQLitePhoneRepository';
import { getPhonesSchema } from './schema';
import { GetPhonesErrors, unauthorizedErrorStatusMsg } from './errors';

export const GET_PHONES_ENDPOINT = '/user/phones' as const;

type StatusCode = 200 | 401;

const statusToMessage: {
  [K in Exclude<GetPhonesErrors, typeof unauthorizedErrorStatusMsg>]: { error: string };
} = {};

const statusToCode: { [K in GetPhonesErrors | 'SUCCESSFUL']: StatusCode } = {
  SUCCESSFUL: 200,
  [unauthorizedErrorStatusMsg]: 401,
};

interface Deps {
  phoneRepository: typeof defaultPhoneRepository;
}

export default function registerGetPhones(
  deps: Deps = { phoneRepository: defaultPhoneRepository },
) {
  return async function (fastify: FastifyInstance) {
    fastify.get(GET_PHONES_ENDPOINT, getPhonesSchema, async (request, reply) => {
      try {
        const userId = request.userId!;
        const result = await processGetPhones(deps.phoneRepository, { userId });

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
