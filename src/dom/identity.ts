import { uuid } from 'spica/uuid';

const id = uuid().slice(-7);
let counter = 0;

export function uid(): string {
  return `id-${id}-${++counter}`;
}
