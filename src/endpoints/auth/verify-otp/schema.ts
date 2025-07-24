import { errorSchema } from '../../common/errorSchema';

export const verifyOtpSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
      },
      400: errorSchema,
      500: errorSchema,
    },
  },
};
