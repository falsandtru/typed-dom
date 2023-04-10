import { splice } from 'spica/array';

export namespace symbols {
  // Optional
  export const proxy = Symbol.for('typed-dom::proxy');
  // Optional
  export const events = Symbol.for('typed-dom::events');
}

interface Target {
  readonly element: Element & {
    readonly [symbols.proxy]?: Target;
  };
  readonly [symbols.events]?: Events;
}

export class Events {
  public static get(target: Target): Events | undefined {
    return target[symbols.events] ?? target.element[symbols.proxy]?.[symbols.events];
  }
  public static hasConnectionListener(target: Target): boolean {
    const events = this.get(target);
    return events
      ? events.targets.length > 0 || events.connect || events.disconnect
      : false;
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
      const events = Events.get(target);
      events?.dispatchConnectEvent();
      if (!events?.connect) continue;
      target.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: false }));
    }
  }
  public dispatchDisconnectEvent(
    targets: readonly Target[] = this.targets,
  ): void {
    if (targets.length === 0) return;
    if (targets !== this.targets && !this.element.isConnected) return;
    for (const target of targets) {
      const events = Events.get(target);
      events?.dispatchDisconnectEvent();
      if (!events?.disconnect) continue;
      target.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: false }));
    }
  }
}
