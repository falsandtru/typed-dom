import { global } from 'spica/global';
import { rnd0z, unique } from 'spica/random';

const ids = Symbol.for('typed-dom::ids');
export const identity = unique(rnd0z, 1, global[ids] ??= Object.create(null));
assert(global[ids]);
