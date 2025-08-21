import { errorSchema } from '../../../../common/infrastructure/enpoints/errorSchema';

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
      201: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
      },
      400: errorSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
};
