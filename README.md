# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Enhance dom manipulability via static typings of TypeScript.

```ts
import TypedHTML from 'typed-dom';

const component = TypedHTML.article({
  title: TypedHTML.h1(['title']),
  content: TypedHTML.ul([
    TypedHTML.li(['item']),
    TypedHTML.li(['item']),
  ])
});
assert(component.raw.nodeName === 'ARTICLE');
assert(component.raw.outerHTML === '<article><h1>title</h1><ul><li>item</li><li>item</li></ul></article>');
assert(component.contents.title.raw.nodeName === 'H1');
assert(component.contents.title.raw.outerHTML === '<h1>title</h1>');
assert(component.contents.content.raw.nodeName === 'UL');
assert(component.contents.content.raw.outerHTML === '<ul><li>item</li><li>item</li></ul>');
```
