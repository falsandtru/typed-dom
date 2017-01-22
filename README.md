# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Enhance dom manipulability via static typings of TypeScript.

[typed-dom.d.ts](typed-dom.d.ts)

```ts
import TypedHTML from 'typed-dom';

const component = TypedHTML.article({
  title: TypedHTML.h1('title'),
  content: TypedHTML.ul([
    TypedHTML.li('item'),
    TypedHTML.li('item'),
  ])
});
assert(component.element.outerHTML === '<article><h1>title</h1><ul><li>item</li><li>item</li></ul></article>');
assert(component.children.title.element.outerHTML === '<h1>title</h1>');
assert(component.children.title.children === 'title');
assert(component.children.content.element.outerHTML === '<ul><li>item</li><li>item</li></ul>');
assert(component.children.content.children[0].content === 'item');
```
