import { splice } from 'spica/array';

export namespace symbols {
  // Optional
  export const proxy = Symbol.for('typed-dom::proxy');
  // Optional
  export const listeners = Symbol.for('typed-dom::listeners');
}

interface Target {
  readonly element: Element & {
    readonly [symbols.proxy]?: Target;
  };
  readonly [symbols.listeners]?: Listeners;
}

export class Listeners {
  public static of(target: Target): Listeners | undefined {
    return target[symbols.listeners] ?? target.element[symbols.proxy]?.[symbols.listeners];
  }
  public static hasConnectionListener(target: Target): boolean {
    const listeners = this.of(target);
    if (!listeners) return false;
    return listeners.targets.length > 0 || listeners.connect || listeners.disconnect;
  }
  constructor(
    private readonly element: Element,
  ) {
  }
  public get mutate(): boolean {
    return 'onmutate' in this.element
        && null != this.element['onmutate'];
  }
  public get connect(): boolean {
    return 'onconnect' in this.element
        && null != this.element['onconnect'];
  }
  public get disconnect(): boolean {
    return 'ondisconnect' in this.element
        && null != this.element['ondisconnect'];
  }
  private readonly targets: Target[] = [];
  public add(target: Target): void {
    const i = this.targets.indexOf(target);
    i === -1 && this.targets.push(target);
  }
  public del(target: Target): void {
    const i = this.targets.indexOf(target);
    i !== -1 && splice(this.targets, i, 1);
  }
  public dispatchMutateEvent(): void {
    if (!this.mutate) return;
    this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: false }));
  }
  public dispatchConnectEvent(
    targets: readonly Target[] = this.targets,
  ): void {
    if (targets.length === 0) return;
    if (targets !== this.targets && !this.element.isConnected) return;
    for (const target of targets) {
      const listeners = Listeners.of(target);
      listeners?.dispatchConnectEvent();
      if (!listeners?.connect) continue;
      target.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: false }));
    }
  }
  public dispatchDisconnectEvent(
    targets: readonly Target[] = this.targets,
  ): void {
    if (targets.length === 0) return;
    if (targets !== this.targets && !this.element.isConnected) return;
    for (const target of targets) {
      const listeners = Listeners.of(target);
      listeners?.dispatchDisconnectEvent();
      if (!listeners?.disconnect) continue;
      target.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: false }));
    }
  }
}
