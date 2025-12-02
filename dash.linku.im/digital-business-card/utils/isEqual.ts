export function isEqual(a: any, b: any): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
