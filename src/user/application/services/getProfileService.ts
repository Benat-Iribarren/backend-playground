import { TokenUser } from '@common/domain/model/TokenUser';
import { UserProfile } from '@src/user/domain/model/UserProfile';
import { TokenReader } from '@auth/domain/interfaces/repositories/TokenReader';
import { UserRepository } from '@src/user/domain/interfaces/repositories/UserRespository';

export const tokenNotFoundErrorStatusMsg = 'TOKEN_NOT_FOUND' as const;
export const userNotFoundErrorStatusMsg = 'USER_NOT_FOUND' as const;

export type GetProfileServiceErrors =
  | typeof tokenNotFoundErrorStatusMsg
  | typeof userNotFoundErrorStatusMsg;

type GetProfileInput = { token: TokenUser };
type GetProfileResponse = UserProfile;

export async function getProfileService(
  tokenReader: TokenReader,
  userRepository: UserRepository,
  input: GetProfileInput,
): Promise<GetProfileServiceErrors | GetProfileResponse> {
  const { token } = input;

  const userId = await tokenReader.getUserIdByToken(token);
  if (tokenDoesntResolve(userId)) {
    return tokenNotFoundErrorStatusMsg;
  }

  const profile = await userRepository.getProfile(userId);
  if (profileDoesntExist(profile)) {
    return userNotFoundErrorStatusMsg;
  }

  return profile;
}

function tokenDoesntResolve(userId: number | null): userId is null {
  return userId === null;
}
function profileDoesntExist(profile: UserProfile | null): profile is null {
  return profile === null;
}
