const HASH_FORMAT = new RegExp(/^[a-f0-9]{64}$/i);
export function invalidHash(hash: string): boolean {
  return !HASH_FORMAT.test(hash);
}
