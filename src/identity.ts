import { global } from 'spica/global';
import { rnd0z, unique } from 'spica/random';

const ids = Symbol.for('typed-dom::ids');
const id = unique(rnd0z, 1, global[ids] ??= Object.create(null))();
assert(global[ids]);
assert(id === id.toLowerCase());
let counter = 0;

export function identity(): string {
  return `rnd-${id}-${++counter}`;
}
