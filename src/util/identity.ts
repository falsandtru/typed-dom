import { global, Set } from 'spica/global';
import { rnd0Z, unique } from 'spica/random';

const id = unique(rnd0Z, 2, global[Symbol.for('typed-dom::ids')] ??= new Set())();
const rnd = unique(rnd0Z);
const mask = 32 - 1;
const dict = Object.freeze([...Array(36)].map((_, i) => i.toString(36)));
assert(dict.every(c => c.length === 1));
assert(dict.length > mask);
let r = '';
let c = mask;

export const identity = () => `${id}-${c === mask ? r = rnd() : r}${dict[c = ++c & mask]}`;
assert(/^\w+-\w0$/.test(identity()));
