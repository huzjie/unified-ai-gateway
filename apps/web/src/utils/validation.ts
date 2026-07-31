/** 表单校验 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
