import { errorSchema } from '../../common/errorSchema';

export const verifyOtpSchema = {
  schema: {
    body: {
      type: 'object',
      properties: {
        hash: { type: 'string' },
        verificationCode: { type: 'string' },
      },
      additionalProperties: false,
    },
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
