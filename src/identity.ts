import { uuid } from 'spica/uuid';

const unique = uuid().split('-').pop()!;
let counter = 0;

export function id(): string {
  return `id-${unique}-${++counter}`;
}
