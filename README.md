# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Static typed dom component builder.
Enhance dom manipulability via static typings of TypeScript.

[typed-dom.d.ts](typed-dom.d.ts)

```ts
import TypedHTML from 'typed-dom';

const id = 'id';
const component = TypedHTML.article({ id }, {
  style: TypedHTML.style(`#${id} ul { width: 100px; }`),
  title: TypedHTML.h1('title'),
  content: TypedHTML.ul([
    TypedHTML.li('item'),
    TypedHTML.li('item'),
  ])
});
assert(component.element.outerHTML === '<article id="id"><style>#id ul { width: 100px; }</style><h1>title</h1><ul><li>item</li><li>item</li></ul></article>');
assert(component.children.title.element.outerHTML === '<h1>title</h1>');
assert(component.children.title.children === 'title');
assert(component.children.content.element.outerHTML === '<ul><li>item</li><li>item</li></ul>');
assert(component.children.content.children[0].children === 'item');
```
