# typed-dom

[![Build Status](https://travis-ci.org/falsandtru/typed-dom.svg?branch=master)](https://travis-ci.org/falsandtru/typed-dom)

Statically typed DOM component builder.

**Visualize** DOM structures and **Assist** DOM access by static types of TypeScript.

## APIs

### HTML: { [tagname]: (attrs?, children?, factory?) => El; };

Create an HTML element proxy.

- attrs: Record<string, string | EventListener | null | undefined>
- children: undefined | string | El[] | Record<string, El>
- factory: () => Element

```ts
import { HTML } from 'typed-dom';

HTML.p();
HTML.p('text');
HTML.p([HTML.a()]);
HTML.p({ link: HTML.a() }]);
HTML.p({ id: 'id' });
HTML.p(() => document.createElement('p'));
```

### SVG: { [tagname]: (attrs?, children?, factory?) => El; };

Create an SVG element proxy.

- attrs: Record<string, string | EventListener | null | undefined>
- children: undefined | string | El[] | Record<string, El>
- factory: () => Element

```ts
import { SVG } from 'typed-dom';

SVG.svg();
```

### Shadow: { [tagname]: (attrs?, children?, factory?) => El; };

Create an HTML element proxy which make open shadow DOM to append children.

- attrs: Record<string, string | EventListener | null | undefined>
- children: undefined | string | El[] | Record<string, El>
- factory: () => Element

```ts
import { Shadow } from 'typed-dom';

Shadow.section();
```

### API

#### Create APIs

All exposed APIs to create a proxy can be redefined as follows:

```ts
import { API, shadow, html, svg } from 'typed-dom';

const Shadow: API<ShadowHostElementTagNameMap> = API(html, shadow);
const HTML: API<HTMLElementTagNameMap> = API(html);
const SVG: API<SVGElementTagNameMap> = API(svg);
```

#### Extend APIs

Custom elements will be defined by extending `ShadowHostElementTagNameMap`, `HTMLElementTagNameMap`, or `SVGElementTagNameMap` interface.

```ts
import { Shadow, HTML } from 'typed-dom';

declare global {
  interface ShadowHostElementTagNameMap {
    'custom-tag': HTMLElement;
  }
  interface HTMLElementTagNameMap {
    'custom': HTMLElement;
  }
}

window.customElements.define('custom-tag', class extends HTMLElement { });
Shadow('custom-tag').element.outerHTML; // '<custom-tag></custom-tag>'
HTML('custom-tag').element.outerHTML; // '<custom-tag></custom-tag>'
HTML.custom().element.outerHTML; // '<custom></custom>'
```

### Others

- El
- proxy
- frag
- shadow
- html
- svg
- text
- define
- listen
- once
- delegate
- bind
- currentTargets
- apply

## Usage

Build a typed DOM component with styling.

```ts
import { HTML } from 'typed-dom';

const component = HTML.article({
  style: HTML.style(`$scope ul { width: 100px; }`),
  title: HTML.h1(`title`),
  content: HTML.ul([
    HTML.li(`item`),
    HTML.li(`item`),
  ])
});
```

Then this component has the following static type generated by type inference.

```ts
type ComponentTypeIs =
El<"article", Element, {
  style: El<"style", HTMLStyleElement, string>;
  title: El<"h1", HTMLHeadingElement, string>;
  content: El<"ul", HTMLUListElement, readonly El<"li", HTMLLIElement, string>[]>;
}>;

// Note: El type is defined as follows.
export interface El<
  T extends string = string,
  E extends Element = Element,
  C extends ElChildren = ElChildren,
  > {
  readonly element: E;
  children: C;
}
type ElChildren
  = ElChildren.Void
  | ElChildren.Text
  | ElChildren.Array
  | ElChildren.Record;
namespace ElChildren {
  export type Void = undefined;
  export type Text = string;
  export type Array = readonly El[];
  export type Record = { [field: string]: El; };
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
  HTML.li('Item'),
];
component.children.content.element.outerHTML; // '<ul><li>Item</li></ul>'

// - HTML
component.children.title = HTML.h1('Title!');
component.children.content = HTML.ul([
  HTML.li('Item!'),
]);
component.element.outerHTML; // '<article class="RANDOM>"><style>.RANDOM ul { width: 100px; }</style><h1>Title!</h1><ul><li>Item!</li></ul></article>'
```

## Examples

### DOM Components

Define composable DOM components.

```ts
import { Shadow, HTML, El } from 'typed-dom';

class Component implements El {
  private readonly dom = HTML.section({
    style: HTML.style(`$scope ul { width: 100px; }`),
    content: HTML.ul([
      HTML.li(`item`),
    ]),
  });
  public readonly element = this.dom.element;
  public get children() {
    return this.dom.children.content.children;
  }
  public set children(children) {
    this.dom.children.content.children = children;
  }
}

class ShadowComponent implements El {
  private readonly dom = Shadow.section({
    style: HTML.style(`ul { width: 100px; }`),
    content: HTML.ul([
      HTML.li(`item`),
    ]),
  });
  public readonly element = this.dom.element;
  public get children() {
    return this.dom.children.content.children;
  }
  public set children(children) {
    this.dom.children.content.children = children;
  }
}
```

Define autonomous DOM components which orient choreography, not orchestration.
This coroutine supports the actor model and the supervisor/worker pattern (using spica/supervisor).

```ts
import { Shadow, HTML, El } from 'typed-dom';
import { Coroutine } from 'spica/coroutine';

class Component extends Coroutine implements El {
  constructor() {
    super(function* (this: Component) {
      while (true) {
        yield;
      }
    }, { trigger: 'element', size: Infinity });
  }
  private readonly dom = Shadow.section({
    style: HTML.style(`ul { width: 100px; }`),
    content: HTML.ul([
      HTML.li(`item`),
    ]),
  });
  public readonly element = this.dom.element;
  public get children() {
    return this.dom.children.content.children;
  }
  public set children(children) {
    this.dom.children.content.children = children;
  }
}
```

### Translation

Create a custom API for translation.

```ts
import { API, html, define } from 'typed-dom';
import { Attrs } from 'typed-dom/internal';

const i18n = i18next.createInstance({
  lng: 'en',
  resources: {
    en: {
      translation: {
        "a": "{{data}}",
      }
    }
  }
});
interface TransDataMap {
  'a': { data: string; };
}
const memory = new WeakMap<Node, object>();
const data = <K extends keyof TransDataMap>(data: TransDataMap[K]) =>
  <T extends string, E extends Element>(factory: (tag: T, attrs: Attrs, children: string) => E, tag: T, attrs: Attrs, children: K): E => {
    const el = factory(tag, attrs, children);
    void memory.set(el, data);
    return el;
  };
const trans: API<HTMLElementTagNameMap> = API((tag: keyof HTMLElementTagNameMap, ...args: any[]) =>
  define(html(tag, {
    onchange: args.every(arg => typeof arg !== 'string')
      ? undefined
      : (ev, el = proxy<string>(ev.target as HTMLElement)) =>
          i18n.init((err, t) =>
            el.children = err
              ? 'Failed to init i18next.'
              : t(el.children, memory.get(el.element))),
  }), ...args));

const el = trans.span('a', data({ data: 'A' }));
assert(el.children === 'A');
assert(el.element.textContent === 'A');
```

## Dependencies

- unassert (in compiling source code)
