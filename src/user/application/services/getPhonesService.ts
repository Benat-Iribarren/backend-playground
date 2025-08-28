import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';
import { UserId } from '@common/domain/model/UserParameters';

export async function processGetPhones(
  userRepository: UserRepository,
  { userId }: { userId: UserId },
) {
  const rows = await userRepository.getPhones(userId);
  return { phones: rows ?? [] };
}
