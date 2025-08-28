import { FastifyInstance } from 'fastify';
import { deleteCardSchema } from './schema';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';
import { cardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';

export const DELETE_CARD_ENDPOINT = '/user/card/:cardToken' as const;

type Headers = { authorization: string };
type Params = { cardToken: string };

export function registerDeleteCard(app: FastifyInstance) {
  app.delete<{ Headers: Headers; Params: Params }>(
    DELETE_CARD_ENDPOINT,
    deleteCardSchema,
    async (request, reply) => {
      try {
        const bearer = request.headers.authorization;
        const accessToken = bearer.replace(/^Bearer\s+/i, '');

        const userId = await tokenRepository.getUserIdByToken(accessToken);
        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized.' });
        }

        const { cardToken } = request.params as Params;
        await cardRepository.deleteCardByTokenAndUserId(userId, cardToken);

        return reply.code(204).send();
      } catch (err) {
        request.log.error({ err }, 'delete card failed');
        return reply.code(500).send({ error: 'Internal Server Error' });
      }
    },
  );
}
