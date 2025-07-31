import { otpStorage } from '../otpStorage';
import { otpRepository } from '../database/operations/otpOperations';
import { Hash } from '../../domain/model/hashType';
import { Otp } from '../../domain/model/otpType';

jest.mock('../database/operations/otpOperations', () => ({
  otpRepository: {
    saveOtpToDb: jest.fn(),
    otpCodeExistsInDb: jest.fn(),
    hashCodeExistsInDb: jest.fn(),
    getOtpByHash: jest.fn(),
    getExpirationDate: jest.fn(),
    deleteOtpFromHashCode: jest.fn(),
  },
}));

describe('otpStorage', () => {
  const mockHash: Hash = 'mockhash';
  const mockOtp: Otp = '123456';
  const notExpiratedDate = '3000-01-01';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveOtp', () => {
    const mockSave = jest.spyOn(otpRepository, 'saveOtpToDb').mockResolvedValue();

    it('Should return an expiration date five minutes from now', async () => {
      const actualTime = Date.now();
      otpStorage.saveOtp(mockHash, mockOtp);

      expect(mockSave).toHaveBeenCalledWith(mockHash, mockOtp, expect.any(String));

      const expirationString = mockSave.mock.calls[0][2];
      const expirationDate = new Date(expirationString).getTime();

      const fiveMinutesInMilliseconds = 1000 * 60 * 5;
      const diff = expirationDate - actualTime;

      expect(diff).toBeGreaterThanOrEqual(fiveMinutesInMilliseconds);
      expect(diff).toBeLessThanOrEqual(fiveMinutesInMilliseconds + 100);
    });
  });

  describe('otpCodeExists', () => {
    it('Should return true when otp code exists in data base', async () => {
      const otpCodeExistsInDbMock = jest
        .spyOn(otpRepository, 'otpCodeExistsInDb')
        .mockResolvedValue(true);

      const result = await otpStorage.otpCodeExists(mockOtp);

      expect(result).toBe(true);
      expect(otpCodeExistsInDbMock).toHaveBeenCalledWith(mockOtp);
      expect(otpCodeExistsInDbMock).toHaveBeenCalledTimes(1);
    });
    it('Should return false when otp code does not exists in data base', async () => {
      const otpCodeExistsInDbMock = jest
        .spyOn(otpRepository, 'otpCodeExistsInDb')
        .mockResolvedValue(false);

      const result = await otpStorage.otpCodeExists(mockOtp);

      expect(result).toBe(false);
      expect(otpCodeExistsInDbMock).toHaveBeenCalledWith(mockOtp);
      expect(otpCodeExistsInDbMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('hashCodeExists', () => {
    it('Should return true when hash code exists in data base', async () => {
      const hashCodeExistsInDbMock = jest
        .spyOn(otpRepository, 'hashCodeExistsInDb')
        .mockResolvedValue(true);

      const result = await otpStorage.hashCodeExists(mockHash);

      expect(result).toBe(true);
      expect(hashCodeExistsInDbMock).toHaveBeenCalledWith(mockHash);
      expect(hashCodeExistsInDbMock).toHaveBeenCalledTimes(1);
    });
    it('Should return false when hash code does not exists in data base', async () => {
      const hashCodeDoesNotExistsInDbMock = jest
        .spyOn(otpRepository, 'hashCodeExistsInDb')
        .mockResolvedValue(false);

      const result = await otpStorage.hashCodeExists(mockHash);

      expect(result).toBe(false);
      expect(hashCodeDoesNotExistsInDbMock).toHaveBeenCalledWith(mockHash);
      expect(hashCodeDoesNotExistsInDbMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('otpExpired', () => {
    it('Should return true when the OTP is expired', async () => {
      const getOtpByHashMock = jest.spyOn(otpRepository, 'getOtpByHash').mockResolvedValue(mockOtp);

      const expiratedDate = '2000-01-01';
      const getExpirationDateMock = jest
        .spyOn(otpRepository, 'getExpirationDate')
        .mockResolvedValue(expiratedDate);

      const otpCodeExistsMock = jest
        .spyOn(otpRepository, 'otpCodeExistsInDb')
        .mockResolvedValue(true);

      const result = await otpStorage.otpExpired(mockHash, mockOtp);

      expect(result).toBe(true);
      expect(getOtpByHashMock).toHaveBeenCalledWith(mockHash);
      expect(getExpirationDateMock).toHaveBeenCalledWith(mockHash);
      expect(otpCodeExistsMock).toHaveBeenCalledWith(mockOtp);
    });
    it('Should return false when the OTP is not expired', async () => {
      const getOtpByHashMock = jest.spyOn(otpRepository, 'getOtpByHash').mockResolvedValue(mockOtp);

      const getExpirationDateMock = jest
        .spyOn(otpRepository, 'getExpirationDate')
        .mockResolvedValue(notExpiratedDate);

      const otpCodeExistsMock = jest
        .spyOn(otpRepository, 'otpCodeExistsInDb')
        .mockResolvedValue(true);

      const result = await otpStorage.otpExpired(mockHash, mockOtp);

      expect(result).toBe(false);
      expect(getOtpByHashMock).toHaveBeenCalledWith(mockHash);
      expect(getExpirationDateMock).toHaveBeenCalledWith(mockHash);
      expect(otpCodeExistsMock).toHaveBeenCalledWith(mockOtp);
    });
    it('Should return false when the OTP do not matches hash', async () => {
      const otpMatchesHashMock = jest.spyOn(otpStorage, 'otpMatchesHash').mockResolvedValue(false);

      const result = await otpStorage.otpExpired(mockHash, mockOtp);

      expect(result).toBe(false);
      expect(otpMatchesHashMock).toHaveBeenCalledWith(mockHash, mockOtp);
    });
    it('Should return true when OTP is undefined', async () => {
      jest.spyOn(otpStorage, 'otpMatchesHash').mockResolvedValue(true);
      jest.spyOn(otpRepository, 'otpCodeExistsInDb').mockResolvedValue(false);

      const result = await otpStorage.otpExpired(mockHash, undefined as any);
      expect(result).toBe(true);
    });

    it('Should return true when OTP does not exist in DB', async () => {
      jest.spyOn(otpRepository, 'otpCodeExistsInDb').mockResolvedValue(false);
      const result = await otpStorage.otpExpired(mockHash, mockOtp);
      expect(result).toBe(true);
    });

    it('Should return false when OTP exists in DB and is valid', async () => {
      jest.spyOn(otpStorage, 'otpMatchesHash').mockResolvedValue(true);
      jest.spyOn(otpRepository, 'otpCodeExistsInDb').mockResolvedValue(true);
      jest.spyOn(otpRepository, 'getOtpByHash').mockResolvedValue(mockOtp);
      jest.spyOn(otpRepository, 'getExpirationDate').mockResolvedValue(notExpiratedDate);

      const result = await otpStorage.otpExpired(mockHash, mockOtp);
      expect(result).toBe(false);
    });
  });
});
