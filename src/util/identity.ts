import 'spica/global';
import { counter } from 'spica/counter';

// uniqueによる実装はメモリを圧迫しqueryのベンチマークが落ちるため不可
export const identity: () => string = global[Symbol.for('typed-dom::identity')]
  ??= counter(62);
