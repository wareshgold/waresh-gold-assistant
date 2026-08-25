export function roundMoney(
  value: number
): number {
  return Math.round(value);
}

/**
 * Format a number with commas as thousands separator.
 * Works reliably in all runtimes (Node, CF Workers, browsers)
 * without depending on Intl.NumberFormat.
 */
export function formatWithCommas(value: number): string {
  const [intPart, decPart] = Math.abs(Math.round(value))
    .toString()
    .split('.');

  const withCommas = intPart
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const result = decPart
    ? `${withCommas}.${decPart}`
    : withCommas;

  return value < 0 ? `-${result}` : result;
}

/**
 * Convert Western digits (0-9) to Persian digits (۰-۹).
 */
export function toPersianDigits(text: string): string {
  return text.replace(/[0-9]/g, d =>
    String.fromCharCode(0x06F0 + Number(d))
  );
}

/**
 * Format a price number with commas and Persian digits.
 * Example: 22123000 → "۲۲,۱۲۳,۰۰۰"
 */
export function formatPrice(value: number): string {
  return toPersianDigits(formatWithCommas(value));
}