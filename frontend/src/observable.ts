type Observer<T> = (state: T) => void;

type EqualsFn<T> = (a: T, b: T) => boolean;

type SetFn<T> = (state: T) => T;

export class Observable<T> {
  private observers: Observer<T>[] = [];
  private state: T;
  private isEqual: EqualsFn<T>;

  constructor(state: T, isEqual: EqualsFn<T> = Object.is) {
    this.state = state;
    this.isEqual = isEqual;
  }

  public get = () => this.state;

  public set = (newState: T | SetFn<T>): T => {
    const state = this.isFunction(newState) ? newState(this.state) : newState;

    if (this.isEqual(state, this.state)) {
      return this.state;
    }

    this.state = state;
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

  private isFunction = (value: T | SetFn<T>): value is SetFn<T> => typeof value === 'function';
}
