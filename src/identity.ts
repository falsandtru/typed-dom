import { uuid } from 'spica/uuid';

const id = uuid().split('-').pop()!;
let counter = 0;

export function uid(): string {
  return `id-${id}-${++counter}`;
}
