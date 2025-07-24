import { errorSchema } from '../../common/errorSchema';

export const requestOtpSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hash: { type: 'string' },
          verificationCode: { type: 'string' },
        },
        required: ['hash', 'verificationCode'],
      },
      400: errorSchema,
      403: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};
