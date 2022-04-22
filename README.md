# typed-dom

![CI](https://github.com/falsandtru/typed-dom/workflows/CI/badge.svg)

A DOM component builder creating type-level DOM structures.

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

Create an HTML element proxy creating open shadow DOM to append children.

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

const Shadow = API<ShadowHostElementTagNameMap>(html, shadow);
const HTML = API<HTMLElementTagNameMap>(html);
const SVG = API<SVGElementTagNameMap>(svg);
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

However, since scoped custom elements don't inherit global custom elements you shouldn't extend the built-in interfaces such as HTMLElementTagNameMap.
Instead, you should define new interfaces and new APIs to define custom elements.

```ts
import { API, shadow, html } from 'typed-dom';

interface CustomShadowHostElementTagNameMap extends ShadowHostElementTagNameMap {
  'custom-tag': HTMLElement;
}
interface CustomHTMLElementTagNameMap extends HTMLElementTagNameMap, CustomShadowHostElementTagNameMap {
  'custom': HTMLElement;
}

export const Shadow = API<CustomShadowHostElementTagNameMap>(html, shadow);
export const HTML = API<CustomHTMLElementTagNameMap>(html);
```

Ideally, you should define custom elements only as scoped custom elements.

```ts
import { API, NS, shadow, element } from 'typed-dom';

interface CustomShadowHostElementTagNameMap extends ShadowHostElementTagNameMap {
  'custom-tag': HTMLElement;
}
interface CustomHTMLElementTagNameMap extends HTMLElementTagNameMap, CustomShadowHostElementTagNameMap {
  'custom': HTMLElement;
}

// Note that the following code is based on the unstandardized APIs of scoped custom elements.
export const html = element<CustomHTMLElementTagNameMap>(
  shadow('section', { mode: 'open', registry: ... }),
  NS.HTML);
export const Shadow = API<CustomShadowHostElementTagNameMap>(html, shadow);
export const HTML = API<CustomHTMLElementTagNameMap>(html);
```

### Others

- El
- proxy
- NS
- frag
- shadow
- html
- svg
- text
- define
- defrag
- listen
- once
- delegate
- bind
- currentTarget
- apply

## Usage

Build a typed DOM component with styling.
APIs replace the `$scope` selector with `:host`, `#<id>`, or `.<generated-id>`.

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
const component: El<"article", HTMLElement, {
  style: El<"style", HTMLStyleElement, string>;
  title: El<"h1", HTMLHeadingElement, string>;
  content: El<"ul", HTMLUListElement, readonly El<"li", HTMLLIElement, string>[]>;
}>

// Note: El type is defined as follows.
export interface El<
  T extends string = string,
  E extends Element = Element,
  C extends El.Children = El.Children,
  > {
  readonly element: E;
  children: C;
}
export namespace El {
  export type Children =
    | Children.Void
    | Children.Text
    | Children.Array
    | Children.Struct;
  export namespace Children {
    export type Void = undefined;
    export type Text = string;
    export type Array = readonly El[];
    export type Struct = { [field: string]: El; };
  }
}
```

You can know the internal structure via the static type which can be used as the visualization.
And you can safely access and manipulate the internal structure using the static type.

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
    super(async function* (this: Component) {
      while (true) {
        yield;
      }
    }, { trigger: 'element', capacity: 0 });
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
import { API, html } from 'typed-dom';
import { Attrs, Children } from 'typed-dom/internal';

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
const Trans = API<HTMLElementTagNameMap>((
  tag: keyof HTMLElementTagNameMap,
  _?: Attrs | Children,
  children?: keyof TransDataMap,
  data?: TransDataMap[keyof TransDataMap],
) =>
  html(tag, {
    onmutate: children
      ? ev =>
          i18n.init((err, t) =>
            proxy<string>(ev.target as HTMLElement)!.children = err
              ? 'Failed to init i18next.'
              : t(children, data))
      : void 0,
  }));
const data = <K extends keyof TransDataMap>(data: TransDataMap[K]) =>
  <T extends string, E extends Element>(
    factory: (tag: T, attrs: Attrs, children: string, data: TransDataMap[keyof TransDataMap]) => E,
    tag: T,
    attrs: Attrs,
    children: K,
  ): E =>
    factory(tag, attrs, children, data);

const el = Trans.span('a', data({ data: 'A' }));
assert(el.children === 'A');
assert(el.element.textContent === 'A');
```

## Dependencies

- unassert (in compiling source code)
