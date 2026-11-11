/**
 * A keyed registry of listeners. Each key holds one or more listeners, and the
 * key is removed as soon as its last listener is gone. This invariant — a key
 * exists if and only if it has at least one listener — lets callers iterate the
 * keys as the set of "active" entries without filtering out empties.
 */
export class ListenerMap<T> {
  #listeners = new Map<string, T[]>();

  /** Adds a listener for the key and returns an unsubscribe function. */
  public add(key: string, listener: T): () => void {
    const existing = this.#listeners.get(key);

    if (existing === undefined) {
      this.#listeners.set(key, [listener]);
    } else {
      existing.push(listener);
    }

    return () => this.remove(key, listener);
  }

  /** Removes a single listener, deleting the key when none remain. */
  public remove(key: string, listener: T): void {
    const listeners = this.#listeners.get(key);

    if (listeners === undefined) {
      return;
    }

    const remaining = listeners.filter((l) => l !== listener);

    if (remaining.length === 0) {
      this.#listeners.delete(key);

      return;
    }

    this.#listeners.set(key, remaining);
  }

  /** Removes every listener stored under the key. */
  public delete(key: string): void {
    this.#listeners.delete(key);
  }

  public get(key: string): readonly T[] | undefined {
    return this.#listeners.get(key);
  }

  public has(key: string): boolean {
    return this.#listeners.has(key);
  }

  public keys(): MapIterator<string> {
    return this.#listeners.keys();
  }

  public entries(): MapIterator<[string, readonly T[]]> {
    return this.#listeners.entries();
  }
}
