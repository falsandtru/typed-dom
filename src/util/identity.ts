import { global } from 'spica/global';
import { rnd0Z, unique } from 'spica/random';

const rnd = unique(rnd0Z);
const dict = [
  ...[...Array(36)].map((_, i) => i.toString(36)),
  ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26),
].join('');
assert(dict.length === 62);
assert(dict[0] === '0');
assert(dict.at(-1) === 'Z');
let r = '';
let c = dict.length - 1;

export const identity: () => string = global[Symbol.for('typed-dom::identity')]
  ??= () => `${++c === dict.length ? r = rnd() : r}${dict[c = c % dict.length]}`;
assert(/^\w0$/.test(identity()));
