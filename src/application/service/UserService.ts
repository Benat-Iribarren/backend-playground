import { UserService } from "../../domain/interfaces/userService";
import { userStorage } from "../../infrastructure/userStorage";

export const UserServiceImpl: UserService = {
    async userExists(user) {
        return userStorage.userExists(user);
    },
    async userBlocked(user) {
        return userStorage.userIsBlocked(user);
    },
}
