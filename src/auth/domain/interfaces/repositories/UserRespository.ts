import { User, Phone, Nin } from '../../model/User';

export interface UserRepository {
  getUser(nin: Nin, phone: Phone): Promise<User | null>;
}
