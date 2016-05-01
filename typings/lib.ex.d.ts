interface String {
  split(separator: string | RegExp, limit?: number): string[];
}

interface Array<T> {
  split(separator: string | RegExp, limit?: number): T[];
}
