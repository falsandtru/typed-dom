import { splice } from 'spica/array';

export namespace symbols {
  export const proxy = Symbol.for('typed-dom::proxy');
  export const events = Symbol.for('typed-dom::events');
}

interface Target {
  readonly element: Element & {
    readonly [symbols.proxy]?: Target & {
      readonly [symbols.events]: Events<Target>;
    };
  };
  readonly [symbols.events]?: Events<Target>;
}

export class Events<T extends Target> {
  public static get(target: Target): Events<Target> {
    return target[symbols.events] ?? target.element[symbols.proxy]![symbols.events];
  }
  public static hasConnectionListener(target: Target): boolean {
    const events = this.get(target);
    return events.targets.length > 0 || events.connect || events.disconnect;
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
  private readonly targets: T[] = [];
  public add(target: T): void {
    const i = this.targets.indexOf(target);
    ~i || this.targets.push(target);
  }
  public del(target: T): void {
    const i = this.targets.indexOf(target);
    ~i && splice(this.targets, i, 1);
  }
  private get isConnected(): boolean {
    return !!this.element.parentNode && this.element.isConnected;
  }
  public dispatchMutateEvent(): void {
    this.mutate && this.element.dispatchEvent(new Event('mutate', { bubbles: false, cancelable: false }));
  }
  public dispatchConnectEvent(
    targets: Target[] = this.targets,
  ): void {
    if (targets.length === 0) return;
    if (targets !== this.targets && !this.isConnected) return;
    for (const target of targets) {
      const events = Events.get(target);
      events.dispatchConnectEvent();
      events.connect && target.element.dispatchEvent(new Event('connect', { bubbles: false, cancelable: false }));
    }
  }
  public dispatchDisconnectEvent(
    targets: Target[] = this.targets,
  ): void {
    if (targets.length === 0) return;
    if (targets !== this.targets && !this.isConnected) return;
    for (const target of targets) {
      const events = Events.get(target);
      events.dispatchDisconnectEvent();
      events.disconnect && target.element.dispatchEvent(new Event('disconnect', { bubbles: false, cancelable: false }));
    }
  }
}
