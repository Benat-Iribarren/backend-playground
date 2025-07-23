export function generateSixDigitCode(): string {
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 10);
    result += randomIndex.toString();
  }
  return result;
}
