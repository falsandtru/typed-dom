# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Static typed dom component builder.

**Visualize** dom structures and **Assist** dom access by static types of TypeScript.

[typed-dom.d.ts](typed-dom.d.ts)

```ts
import TypedHTML from 'typed-dom';

const id = 'id';
const component = TypedHTML.article({ id }, {
  style: TypedHTML.style(`#${id} ul { width: 100px; }`),
  title: TypedHTML.h1(`title`),
  content: TypedHTML.ul([
    TypedHTML.li(`item`),
    TypedHTML.li(`item`),
  ])
});

// inspect
component.element.outerHTML; // '<article id="id"><style>#id ul { width: 100px; }</style><h1>title</h1><ul><li>item</li><li>item</li></ul></article>'
component.children.title.element.outerHTML; // '<h1>title</h1>'
component.children.title.children; // 'title'
component.children.content.element.outerHTML; // '<ul><li>item</li><li>item</li></ul>'
component.children.content.children[0].children; // 'item'

// update
// - text
component.children.title.children = 'Title';
component.children.title.element.outerHTML; // '<h1>Title</h1>'

// - struct
component.children.content.children = [
  TypedHTML.li('Item')
];
component.children.content.element.outerHTML; // '<ul><li>Item</li></ul>'

// - TypedHTML
component.children.title = TypedHTML.h1('Title!');
component.children.content = TypedHTML.ul([
  TypedHTML.li('Item!')
]);
component.element.outerHTML; // '<article id="id"><style>#id ul { width: 100px; }</style><h1>Title!</h1><ul><li>Item!</li></ul></article>'
```
