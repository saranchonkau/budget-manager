import round from "lodash-es/round";

export function getNumberSign(value: number): string {
  return value === 0 ? "" : value > 0 ? "+" : "-";
}
/** 12345678 => "12 345 678" */
export function formatNumber(
  value: number,
  options?: { precision?: number; withSign?: boolean }
): string {
  let result =
    typeof options?.precision === "number"
      ? round(value, options.precision).toFixed(options.precision)
      : value.toString();

  result = result.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ").replace(".", ",");

  if (options?.withSign) {
    result = getNumberSign(value) + result;
  }

  return result;
}

export function generateNumberArray(length: number): Array<number> {
  return Array.from({ length }, (_, index) => index);
}

export function isStringGuard(value: any): value is string {
  return typeof value === "string";
}

export function isObjectGuard(
  value: any
): value is { [key: string]: unknown } | null {
  return typeof value === "object";
}

export function isNonNullObjectGuard(
  value: any
): value is { [key: string]: unknown } {
  return isObjectGuard(value) && Boolean(value);
}

export function isNotNullish<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function notFalsy<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return Boolean(value);
}
