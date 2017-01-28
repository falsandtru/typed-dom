# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Static typed dom component builder.

**Visualize** dom structures and **Assist** dom access by static types of TypeScript.

## API

[typed-dom.d.ts](typed-dom.d.ts)

## Usage

Build a typed dom object.

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
```

Then this component has the following static type generated by type inference.

```ts
type ComponentTypeIs =
TypedHTMLElement<"article", HTMLElement, {
  style: TypedHTMLElement<"style", HTMLStyleElement, string>;
  title: TypedHTMLElement<"title", HTMLHeadingElement, string>;
  content: TypedHTMLElement<"ul", HTMLUListElement, TypedHTMLElement<"li", HTMLLIElement, string>[]>;
}>;

// Note: TypedHTMLElement type is defined as follows in typed-dom.d.ts.
export interface TypedHTMLElement<
  T extends string,
  E extends HTMLElement,
  C extends TypedHTMLElementChildren
>
  extends AbstractTypedHTMLElement<T> {
  readonly element: E;
  children: C;
}
type TypedHTMLElementChildren
  = TypedHTMLElementChildren.Text
  | TypedHTMLElementChildren.Collection
  | TypedHTMLElementChildren.Struct;
namespace TypedHTMLElementChildren {
  export type Text = string;
  export type Collection = TypedHTMLElement<string, HTMLElement, any>[];
  export type Struct = { [name: string]: TypedHTMLElement<string, HTMLElement, any>; };
}
abstract class AbstractTypedHTMLElement<T extends string> {
  private identifier: T;
}
```

You can know the internal structure via this type which can be used as the visualization.
And you can access and manipulate the internal structure safely guided by this type.

```ts
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

## Example

### Micro DOM Component

Use micro dom components to hide and manage the typed dom object.

```ts
import TypedHTML from 'typed-dom';

class MicroComponent {
  constructor(private parent: HTMLElement) {
    parent.appendChild(this.dom.element);
  }
  private id = this.parent.id;
  private dom = TypedHTML.article({ id: this.id }, {
    content: TypedHTML.ul([
      TypedHTML.li(`item`)
    ])
  });
  destroy() {
    this.dom.element.remove();
  }
}
```

### DOM Component

Use dom components to manage the micro dom components.

```ts
import TypedHTML from 'typed-dom';

class Component {
  constructor(private parent: HTMLElement) {
    parent.appendChild(this.element);
  }
  private element = document.createElement('div');
  private children = {
    todo: new MicroComponent(this.element)
  };
  destroy() {
    this.element.remove();
  }
}
```
