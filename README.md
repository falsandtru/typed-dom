# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Static typed DOM component builder.

**Visualize** DOM structures and **Assist** DOM access by static types of TypeScript.

## APIs

### TypedHTML: { [tagname]: (attrs?, children?, factory?) => TypedElement };

- attrs: Record<string, string | EventListener>
- children: undefined | string | TypedElement[] | Record<string, TypedElement>
- factory: () => Element

```ts
import TypedHTML from 'typed-dom';

TypedHTML.p();
TypedHTML.p('text');
TypedHTML.p([TypedHTML.a()]);
TypedHTML.p({ link: TypedHTML.a() }]);
TypedHTML.p({ id: 'id' });
TypedHTML.p(() => document.createElement('p'));
```

### TypedSVG: { [tagname]: (attrs?, children?, factory?) => TypedElement };

- attrs: Record<string, string | EventListener>
- children: undefined | string | TypedElement[] | Record<string, TypedElement>
- factory: () => Element

```ts
import { TypedSVG } from 'typed-dom';

TypedHTML.svg();
```

## Extend APIs

You can define some custom elements by extending `HTMLElementTagNameMap` or `SVGElementTagNameMap_` interface.

```ts
import TypedHTML, { TypedSVG } from 'typed-dom';

declare global {
  interface HTMLElementTagNameMap {
    'custom': HTMLElement;
  }
  interface SVGElementTagNameMap_ {
    'a': SVGAElement;
  }
}

TypedHTML.custom().element.outerHTML; // '<custom></custom>'
TypedSVG.a().element; // SVGAElement
```

## Usage

Build a typed DOM object with styling.

```ts
import TypedHTML from 'typed-dom';

const component = TypedHTML.article({
  style: TypedHTML.style(`$scope ul { width: 100px; }`),
  title: TypedHTML.h1(`title` as string),
  content: TypedHTML.ul([
    TypedHTML.li(`item` as string),
    TypedHTML.li(`item`),
  ])
});
```

Then this component has the following static type generated by type inference.

```ts
type ComponentTypeIs =
El<"article", Element, {
  style: El<"style", HTMLStyleElement, string>;
  title: El<"h1", HTMLHeadingElement, string>;
  content: El<"ul", HTMLUListElement, El<"li", HTMLLIElement, string>[]>;
}>;

// Note: El type is defined as follows.
export interface El<
  T extends string,
  E extends Element,
  C extends ElChildren
  > {
  readonly element: E;
  children: C;
}
type ElChildren
  = ElChildren.Void
  | ElChildren.Text
  | ElChildren.Collection
  | ElChildren.Record;
namespace ElChildren {
  export type Void = undefined;
  export type Text = string;
  export type Collection = El<string, Element, any>[];
  export type Record = { [field: string]: El<string, Element, any>; };
}
```

You can know the internal structure via this type which can be used as the visualization.
And you can access and manipulate safely the internal structure guided by this type.

```ts
// inspect
component.element.outerHTML; // '<article class="RANDOM"><style>.RANDOM ul { width: 100px; }</style><h1>title</h1><ul><li>item</li><li>item</li></ul></article>'
component.children.title.element.outerHTML; // '<h1>title</h1>'
component.children.title.children; // 'title'
component.children.content.element.outerHTML; // '<ul><li>item</li><li>item</li></ul>'
component.children.content.children[0].children; // 'item'

// update
// - text
component.children.title.children = 'Title';
component.children.title.element.outerHTML; // '<h1>Title</h1>'

// - collection
component.children.content.children = [
  TypedHTML.li('Item')
];
component.children.content.element.outerHTML; // '<ul><li>Item</li></ul>'

// - TypedHTML
component.children.title = TypedHTML.h1('Title!');
component.children.content = TypedHTML.ul([
  TypedHTML.li('Item!')
]);
component.element.outerHTML; // '<article class="RANDOM>"><style>.RANDOM ul { width: 100px; }</style><h1>Title!</h1><ul><li>Item!</li></ul></article>'
```

## Examples

### DOM Components

Create DOM components.

```ts
import TypedHTML, { El } from 'typed-dom';

class Component implements El {
  public readonly tag = '';
  private readonly dom = TypedHTML.div({
    style: TypedHTML.style(`$scope ul { width: 100px; }`),
    content: TypedHTML.ul([
      TypedHTML.li(`item`)
    ]),
  });
  public get element() {
    return this.dom.element;
  }
  public get children() {
    return this.dom.children.content.children;
  }
  public set children(children) {
    this.dom.children.content.children = children;
  }
}
```

## Dependencies

- unassert (in compiling source code)
