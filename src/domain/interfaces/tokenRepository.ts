import { HashCode } from "../model/hashCode";
import { Token } from "../model/token";

export interface TokenRepository {
  saveTokenToDb(hash: HashCode, token: Token): Promise<void>;
}
