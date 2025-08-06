import { User, Phone, Nin } from '../../model/user';

export interface UserRepository {
  getUser(nin: Nin, phone: Phone): Promise<User | null>;
}
