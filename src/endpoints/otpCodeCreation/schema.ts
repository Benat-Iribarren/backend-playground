import { errorSchema } from '../common/errorSchema';

export const otpCodeCreationSchema = {
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
      500: errorSchema,
    },
  },
};
