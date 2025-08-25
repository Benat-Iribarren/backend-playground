import {
  successfulStatusMsg,
  userNotFoundErrorStatusMsg,
  emptyPatchErrorStatusMsg,
} from '@user/application/services/updateProfileService';

export { successfulStatusMsg, userNotFoundErrorStatusMsg, emptyPatchErrorStatusMsg };
export const invalidParametersErrorStatusMsg = 'INVALID_PARAMETERS_FORMAT' as const;

export type UpdateProfileErrors =
  | typeof userNotFoundErrorStatusMsg
  | typeof emptyPatchErrorStatusMsg
  | typeof invalidParametersErrorStatusMsg;
