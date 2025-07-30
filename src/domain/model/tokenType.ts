import { Hash } from './hashType';

export type Token = string;

export type TokenStorage = {
  saveToken: (hash: Hash, token: Token) => Promise<void>;
};
