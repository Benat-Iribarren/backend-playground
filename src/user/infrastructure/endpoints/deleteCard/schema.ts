import { errorSchema } from '@common/infrastructure/endpoints/errorSchema';

export const deleteCardSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: { authorization: { type: 'string' } },
      required: ['authorization'],
    },
    body: {
      type: 'object',
      properties: {
        token: { type: 'string', minLength: 1 },
      },
      required: ['token'],
      additionalProperties: false,
    },
    response: {
      204: { type: 'null' },
      400: errorSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
};
