import { errorSchema } from '../common/errorSchema';

export const mainLoginSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          verificationCode: { type: 'string' },
        },
        required: ['verificationCode'],
      },
      400: errorSchema,
      402: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};
