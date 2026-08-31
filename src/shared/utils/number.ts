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
 * Grouped Latin formatting with a fixed number of decimals.
 * Example: formatGrouped(22123000) → "22,123,000"
 *          formatGrouped(2345.6789, 2) → "2,345.68"
 */
export function formatGrouped(value: number, decimals = 0): string {
  const [intPart, decPart] = value.toFixed(decimals).split('.');

  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decPart ? `${grouped}.${decPart}` : grouped;
}

/**
 * Persian display number: Persian digits with ٬ thousands
 * separator and ٫ decimal mark.
 * Example: faNumber(22123000) → "۲۲٬۱۲۳٬۰۰۰"
 *          faNumber(2345.6789, 2) → "۲٬۳۴۵٫۶۸"
 */
export function faNumber(value: number, decimals = 0): string {
  return toPersianDigits(formatGrouped(value, decimals))
    .replace(/,/g, '٬')
    .replace('.', '٫');
}

/**
 * Format a price number as a Persian display value.
 * Example: 22123000 → "۲۲٬۱۲۳٬۰۰۰"
 */
export function formatPrice(value: number): string {
  return formatWithCommas(value);
}