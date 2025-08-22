import { UserProfile } from '@user/domain/model/UserProfile';
import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';

export const userNotFoundErrorStatusMsg = 'USER_NOT_FOUND' as const;

type GetProfileInput = { userId: number };
type GetProfileResponse = UserProfile;
export type GetProfileServiceErrors = typeof userNotFoundErrorStatusMsg;

export async function getProfileService(
  userRepository: UserRepository,
  { userId }: GetProfileInput,
): Promise<GetProfileServiceErrors | GetProfileResponse> {
  const profile = await userRepository.getProfile(userId);
  return profile ?? userNotFoundErrorStatusMsg;
}
