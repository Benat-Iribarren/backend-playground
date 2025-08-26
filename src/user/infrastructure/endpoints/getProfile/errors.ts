import { userNotFoundErrorStatusMsg } from '@auth/domain/errors/userLoginErrors';
export { userNotFoundErrorStatusMsg } from '@user/application/services/getProfileService';
export const unauthorizedErrorStatusMsg = 'UNAUTHORIZED' as const;
export type GetProfileErrors =
  | typeof userNotFoundErrorStatusMsg
  | typeof unauthorizedErrorStatusMsg;
