import { Hash } from '../model/otp';

export interface HashGenerator {
  generateHash(): Hash;
}
