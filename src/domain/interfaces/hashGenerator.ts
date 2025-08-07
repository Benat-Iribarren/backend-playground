import { Hash } from '../model/Otp';

export interface HashGenerator {
  generateHash(): Hash;
}
