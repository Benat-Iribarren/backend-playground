import { User } from "../model/userType";

export interface UserRepository{
    userExistInDB(user: User): Promise<boolean | null>;
    userIsBlocked(user: User): Promise<boolean | null>;
}