import { UserProfile } from '@user/domain/model/UserProfile';
import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';

export const successfulStatusMsg = 'SUCCESSFUL' as const;
export const userNotFoundErrorStatusMsg = 'USER_NOT_FOUND' as const;
export const emptyPatchErrorStatusMsg = 'EMPTY_PATCH' as const;

type UpdateProfileInput = {
  userId: number;
  data: Partial<Pick<UserProfile, 'fullName' | 'email'>>;
};

export type UpdateProfileServiceResult =
  | typeof successfulStatusMsg
  | typeof userNotFoundErrorStatusMsg
  | typeof emptyPatchErrorStatusMsg;

export async function processUpdateProfile(
  userRepository: UserRepository,
  { userId, data }: UpdateProfileInput,
): Promise<UpdateProfileServiceResult> {
  if (Object.keys(data).length === 0) {
    return emptyPatchErrorStatusMsg;
  }

  const updated = await userRepository.updateProfile(userId, data);
  return updated ? successfulStatusMsg : userNotFoundErrorStatusMsg;
}
