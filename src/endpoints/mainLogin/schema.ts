import { errorSchema } from '../common/errorSchema';

export const mainLoginSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        required: ['message'],
      },
      400: errorSchema,
      402: errorSchema,
      500: errorSchema,
    },
  },
};
