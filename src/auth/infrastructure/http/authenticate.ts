import fp from 'fastify-plugin';
import { extractBearer } from '@common/infrastructure/helpers/extractBearer';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: number;
  }
}

export default fp(async (fastify) => {
  fastify.decorateRequest<number | undefined>('userId', undefined);

  fastify.addHook('preHandler', async (req, reply) => {
    const token = extractBearer(req.headers.authorization ?? '');
    if (!token) {
      return reply.code(401).send({ error: 'Unauthorized.' });
    }

    const userId = await tokenRepository.getUserIdByToken(token);
    if (userId === null || userId === undefined) {
      return reply.code(401).send({ error: 'Unauthorized.' });
    }

    req.userId = userId;
  });
});
