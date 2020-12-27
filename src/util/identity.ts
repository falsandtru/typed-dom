import { global } from 'spica/global';
import { rnd0Z, unique } from 'spica/random';

const ids = Symbol.for('typed-dom::ids');
export const identity = unique(rnd0Z, 2, global[ids] ??= Object.create(null));
assert(global[ids]);
