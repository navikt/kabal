type Observer<T> = (state: T) => void;

type EqualsFn<T> = (a: T, b: T) => boolean;

type SetFn<T> = (state: T) => void;

export class Observable<T extends string | number | boolean | object> {
  private observers: Observer<T>[] = [];
  private state: T;
  private equals: EqualsFn<T>;

  constructor(state: T, equals: EqualsFn<T> = Object.is) {
    this.state = state;
    this.equals = equals;
  }

  public get = () => this.state;

  public set = (newState: T | SetFn<T>): T => {
    const _newState = typeof newState === 'function' ? newState(this.state) : newState;

    if (this.equals(_newState, this.state)) {
      return this.state;
    }

    this.state = _newState;
    this.notify();
    return this.state;
  };

  public subscribe = (observer: Observer<T>) => {
    this.observers.push(observer);

    return () => this.unsubscribe(observer);
  };

  public unsubscribe = (observer: Observer<T>) => {
    this.observers = this.observers.filter((obs) => obs !== observer);
  };

  private notify = () => {
    for (const observer of this.observers) {
      observer(this.state);
    }
  };
}
