const DNI_FORMAT = new RegExp(/^[0-9]{8}[a-zA-Z]$/);
const NIE_FORMAT = new RegExp(/^[XYZxyz]\d{7}[a-zA-Z]$/);
const CIF_FORMAT = new RegExp(/^([ABCDEFGHJKLMNPQRSUVWabcdefghjklmnpqrsuvw])(\d{7})([0-9A-Ja-j])$/);
export function isValidNin(nin: string): boolean {
  return DNI_FORMAT.test(nin) || NIE_FORMAT.test(nin) || CIF_FORMAT.test(nin);
}
