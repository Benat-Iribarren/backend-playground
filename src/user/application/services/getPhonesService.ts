import { PhoneRepository } from '@user/domain/interfaces/repositories/PhoneRepository';
import { UserId } from '@common/domain/model/UserParameters';

export async function processGetPhones(
  phoneRepository: PhoneRepository,
  { userId }: { userId: UserId },
) {
  const rows = await phoneRepository.getPhones(userId);
  return { phones: rows ?? [] };
}
