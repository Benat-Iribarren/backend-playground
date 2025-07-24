import { errorSchema } from '../../common/errorSchema';

export const verifyOtpSchema = {
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
      403: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};
