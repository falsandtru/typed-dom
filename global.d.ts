import assert from 'power-assert';

type Assert = typeof assert;

declare global {
  interface ObjectConstructor {
    values<T>(o: { [s: string]: T } | { [n: number]: T }): T[];
  }
}

declare global {
  const assert: Assert;
}
