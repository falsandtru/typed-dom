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
  constructor(
    private readonly element: Element,
  ) {
  }
  public get mutation(): boolean {
    return 'onmutate' in this.element
        && null != this.element['onmutate'];
  }
  public get connection(): boolean {
    return 'onconnect' in this.element
        && null != this.element['onconnect'];
  }
  public get disconnection(): boolean {
    return 'ondisconnect' in this.element
        && null != this.element['ondisconnect'];
  }
  public haveConnectionListener(): boolean {
    return this.targets.length > 0 || this.connection || this.disconnection;
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
    if (!this.mutation) return;
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
      if (!listeners?.connection) continue;
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
      if (!listeners?.disconnection) continue;
      target.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: false }));
    }
  }
}
