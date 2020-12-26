import { rnd0Z } from 'spica/random';

const unique = rnd0Z(8);
let counter = 0;

export function identity(): string {
  return `id-${unique}-${++counter}`;
}
