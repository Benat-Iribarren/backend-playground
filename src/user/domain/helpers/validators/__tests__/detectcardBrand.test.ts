import { detectCardBrand } from '@user/domain/helpers/validators/detectCardBrand';

describe('detectCardBrand', () => {
  it('returns VISA', () => {
    expect(detectCardBrand('4111111111111111')).toBe('VISA');
  });

  it('returns VISA', () => {
    expect(detectCardBrand('4111-1111-1111-1111')).toBe('VISA');
  });

  it('returns VISA', () => {
    expect(detectCardBrand('4111 1111 1111 1111')).toBe('VISA');
  });

  it('returns MASTERCARD', () => {
    expect(detectCardBrand('5555555555554444')).toBe('MASTERCARD');
  });

  it('returns AMEX', () => {
    expect(detectCardBrand('371449635398431')).toBe('AMEX');
  });

  it('returns UNKNOWN for others', () => {
    expect(detectCardBrand('1234567890123456')).toBe('UNKNOWN');
  });
});
