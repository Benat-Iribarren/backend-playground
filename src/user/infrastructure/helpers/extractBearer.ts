export function extractBearer(authHeader: string): string | null {
  const m = /^Bearer\s+(.+)$/.exec(authHeader);
  return m?.[1] ?? null;
}
