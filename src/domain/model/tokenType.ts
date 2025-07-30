import { Hash } from './hashType';

export type Token = string;

export type TokenStorage = {
  saveToken: (token: Token) => Promise<void>;
};
