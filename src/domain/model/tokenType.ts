import { HashCode } from './hashCode';

export type Token = string;

export type TokenStorage = {
  saveToken: (hash: HashCode, token: Token) => Promise<void>;
};
