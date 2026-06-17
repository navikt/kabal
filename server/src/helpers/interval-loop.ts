/**
 * A self-guarding wrapper around setInterval. Runs an async tick on a fixed
 * interval, routes tick rejections to an error handler, and exposes idempotent
 * start/stop so callers don't have to track the timer handle themselves.
 */
export class IntervalLoop {
  #interval: ReturnType<typeof setInterval> | null = null;
  readonly #intervalMs: number;
  readonly #onError: (error: unknown) => void;

  constructor(intervalMs: number, onError: (error: unknown) => void) {
    this.#intervalMs = intervalMs;
    this.#onError = onError;
  }

  /** Starts the loop. Idempotent — a running loop is left untouched. */
  public start(tick: () => Promise<void>): void {
    if (this.#interval !== null) {
      return;
    }

    this.#interval = setInterval(() => {
      tick().catch((error) => {
        try {
          this.#onError(error);
        } catch {
          // Swallow any error thrown by the error handler to avoid crashing the loop.
        }
      });
    }, this.#intervalMs);
  }

  /** Stops the loop if running. Idempotent. */
  public stop(): void {
    if (this.#interval === null) {
      return;
    }

    clearInterval(this.#interval);
    this.#interval = null;
  }

  public get isRunning(): boolean {
    return this.#interval !== null;
  }
}
