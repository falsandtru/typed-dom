import { global } from 'spica/global';

// uniqueによる実装はメモリを圧迫しqueryのベンチマークが落ちるため不可
const rnd = (c => () => (c++).toString(36))(0);
const dict = [...Array(36)].map((_, i) => i.toString(36)).join('');
assert(dict.length === 36);
assert(dict[0] === '0');
assert(dict.at(-1) === 'z');
let r = '';
let c = dict.length - 1;

export const identity: () => string = global[Symbol.for('typed-dom::identity')]
  ??= () => `${++c === dict.length ? r = rnd() : r}${dict[c = c % dict.length]}`;
assert(/^\w0$/.test(identity()));
