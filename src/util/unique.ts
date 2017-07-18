let count = 0;

export function unique(): string {
  return `${'0'.repeat(9) + ++count}`.slice(1);
}
