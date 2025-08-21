import { Nin, UserId } from '@common/domain/model/UserParameters';
export type IsBlocked = boolean;
export interface UserAuth {
  id: UserId;
  nin: Nin;
  isBlocked: IsBlocked;
}
