import { User } from "../model/userType";

export interface UserService {
    userExists(user: User): Promise<boolean>;
    userBlocked(user: User): Promise<boolean>;
}