import { Nin, UserId } from '@common/domain/model/UserParameters';
export type Email = string;
export type FullName = string;
export interface UserProfile {
  id: UserId;
  nin: Nin;
  email: Email;
  fullName: FullName;
}
