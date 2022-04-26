# typed-dom

![CI](https://github.com/falsandtru/typed-dom/workflows/CI/badge.svg)

A value-level and type-level DOM builder.

**Visualize** DOM structures and **Assist** DOM access using static types.

```ts
const dom: El<"article", HTMLElement, {
  style: El<"style", HTMLStyleElement, string>;
  title: El<"h1", HTMLHeadingElement, string>;
  content: El<"ul", HTMLUListElement, readonly El<"li", HTMLLIElement, string>[]>;
}>
```

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
HTML.p(() => document.querySelector('p'));
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

Create an HTML element proxy assigning the children to the own open shadow DOM.

- attrs: Record<string, string | EventListener | null | undefined>
- children: undefined | string | El[] | Record<string, El>
- factory: () => Element

```ts
import { Shadow } from 'typed-dom';

Shadow.section();
```

### API

#### Create APIs

All the exposed proxy APIs can be redefined as follows:

```ts
import { API, shadow, html, svg } from 'typed-dom';

const Shadow = API<ShadowHostHTMLElementTagNameMap>(html, shadow);
const HTML = API<HTMLElementTagNameMap>(html);
const SVG = API<SVGElementTagNameMap>(svg);
```

#### Extend APIs

Custom elements will be defined by extending `ShadowHostHTMLElementTagNameMap`, `HTMLElementTagNameMap`, or `SVGElementTagNameMap` interface.

```ts
import { Shadow, HTML } from 'typed-dom';

declare global {
  interface ShadowHostHTMLElementTagNameMap {
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

interface CustomShadowHostElementTagNameMap extends ShadowHostHTMLElementTagNameMap {
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
import { API, NS, shadow, html as h, element } from 'typed-dom';

interface ShadowHostScopedCustomHTMLElementTagNameMap extends ShadowHostHTMLElementTagNameMap {
  'custom-tag': HTMLElement;
}
interface ScopedCustomHTMLElementTagNameMap extends HTMLElementTagNameMap, ShadowHostScopedCustomHTMLElementTagNameMap {
  'custom': HTMLElement;
}

// Note that the following code is based on the unstandardized APIs of scoped custom elements.
const registry = new CustomElementRegistry();
// This Host function creates a proxy and makes its shadow DOM in the base document (light DOM).
export const Host = API<ShadowHostHTMLElementTagNameMap>(h, el =>
  shadow(el, { mode: 'open', registry }));
// This html function creates a scoped custom element in a shadow DOM.
export const html = element<ScopedCustomHTMLElementTagNameMap>(
  shadow('body', { mode: 'open', registry }),
  NS.HTML);
// This HTML function creates a scoped custom element proxy in a shadow DOM.
export const HTML = API<ScopedCustomHTMLElementTagNameMap>(html);
// This Shadow function creates a scoped custom element proxy and makes its shadow DOM in a shadow DOM.
export const Shadow = API<ShadowHostScopedCustomHTMLElementTagNameMap>(html, shadow);
```

### Others

- El
- NS
- Attrs
- Children
- Factory
- shadow
- frag
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
APIs replace the `:scope` selector with `:host`, `#<id>`, or `.<generated-id>`.

```ts
import { HTML } from 'typed-dom';

const dom = HTML.article({
  style: HTML.style(`:scope { color: red; }`),
  title: HTML.h1(`Title`),
  content: HTML.ul([
    HTML.li(`item`),
    HTML.li(`item`),
  ])
});
```

Then this component has the following static type generated by type inference.

```ts
const dom: El<"article", HTMLElement, {
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
  readonly tag: string;
  readonly element: E;
  get children(): El.Getter<C>;
  set children(children: El.Setter<C>);
}
export namespace El {
  export type Children =
    | Children.Void
    | Children.Text
    | Children.Array
    | Children.Struct;
  export namespace Children {
    export type Void = void;
    export type Text = string;
    export type Array = readonly El[];
    export type Struct = { [field: string]: El; };
  }
  export type Getter<C extends El.Children> =
    C extends readonly unknown[] ? C :
    C;
  export type Setter<C extends El.Children> =
    C extends readonly unknown[] ? C :
    Partial<C>;
}
```

You can know the internal structure via the static type which can be used as the visualization.
And you can safely access and manipulate the internal structure using the static type.

```ts
// Inspect
dom.element.outerHTML; // '<article class="RANDOM"><style>.RANDOM { color: red; }</style><h1>Title</h1><ul><li>item</li><li>item</li></ul></article>'
dom.children.title.element.outerHTML; // '<h1>Title</h1>'
dom.children.title.children; // 'Title'
dom.children.content.element.outerHTML; // '<ul><li>item</li><li>item</li></ul>'
dom.children.content.children[0].children; // 'item'

// Update
// - Text
dom.children.title.children = 'Text';
dom.children.title.element.outerHTML; // '<h1>Text</h1>'

// - Array
dom.children.content.children = [
  HTML.li('Array'),
];
dom.children.content.element.outerHTML; // '<ul><li>Array</li></ul>'

// - Struct
dom.children = {
  title: HTML.h1('Struct'),
};
dom.children.title.element.outerHTML; // '<h1>Struct</h1>'
dom.children.title = HTML.h1('title');
dom.children.title.element.outerHTML; // '<h1>title</h1>'
```

## Examples

### DOM Components

Define composable DOM components.

```ts
import { Shadow, HTML, El } from 'typed-dom';

class Component implements El {
  private readonly dom = HTML.section({
    style: HTML.style(`:scope { color: red; }`),
    content: HTML.ul([
      HTML.li(`item`),
    ]),
  });
  public readonly tag = this.dom.tag;
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
    style: HTML.style(`:scope { color: red; }`),
    content: HTML.ul([
      HTML.li(`item`),
    ]),
  });
  public readonly tag = this.dom.tag;
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
    style: HTML.style(`:scope { color: red; }`),
    content: HTML.ul([
      HTML.li(`item`),
    ]),
  });
  public readonly tag = this.dom.tag;
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
import { API, Attrs, Factory, html } from 'typed-dom';

const i18n = i18next.createInstance({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'Greeting': 'Hello, {{name}}.',
      },
    },
  },
});
interface TransDataMap {
  'Greeting': { name: string; };
}
const Trans = API<HTMLElementTagNameMap>(html);
const bind = <K extends keyof TransDataMap>(data: TransDataMap[K]) =>
  <T extends keyof HTMLElementTagNameMap>(
    factory: Factory<HTMLElementTagNameMap>,
    tag: T,
    attrs: Attrs,
    children: K,
  ) =>
    factory(tag, void Object.assign<Attrs, Attrs>(attrs, {
      onmutate: ev =>
        void i18n.init((err, t) =>
          (ev.target as HTMLElement).textContent = err
            ? '{% Failed to initialize the translator. %}'
            : t(children, data) ?? `{% Failed to translate "${children}". %}`),
    }));

const el = Trans.span('Greeting', bind({ name: 'world' }));
assert(el.children === 'Hello, world.');
assert(el.element.textContent === 'Hello, world.');
```

## Dependencies

- unassert (in compiling source code)
