# typed-dom

Enhance dom accessibility by static typings of TypeScript.

```ts
import TypedHTML from 'typed-dom';

const struct = TypedHTML.div({
  title: TypedHTML.h1(),
  list: TypedHTML.ul([TypedHTML.li()])
});
assert(struct.raw.nodeName === 'DIV');
assert(struct.contents.title.raw.nodeName === 'H1');
assert(struct.contents.list.raw.nodeName === 'UL');
assert(struct.contents.list.contents[0].raw.nodeName === 'LI');
```
