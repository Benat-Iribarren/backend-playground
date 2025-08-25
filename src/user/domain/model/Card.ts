export type CardId = number;
export type LastFourDigits = string;
export type Brand = string;
export type ExpiryMonth = number;
export type ExpiryYear = number;
export type CardToken = string;
export type IsPrimary = boolean;

export type Card = {
  id: CardId;
  userId: number;
  lastFourDigits: LastFourDigits;
  brand: Brand;
  expiryMonth: ExpiryMonth;
  expiryYear: ExpiryYear;
  token: CardToken;
  isPrimary: IsPrimary;
};

export type NewCard = Omit<Card, 'id'>;
