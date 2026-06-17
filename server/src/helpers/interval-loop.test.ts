import { describe, expect, it, jest } from 'bun:test';
import { IntervalLoop } from '@/helpers/interval-loop';

describe('IntervalLoop', () => {
  it('should not be running before start', () => {
    const loop = new IntervalLoop(1_000, () => undefined);

    expect(loop.isRunning).toBe(false);
  });

  it('should report running state across start and stop', () => {
    const loop = new IntervalLoop(1_000, () => undefined);

    loop.start(() => Promise.resolve());
    expect(loop.isRunning).toBe(true);

    loop.stop();
    expect(loop.isRunning).toBe(false);
  });

  it('should run the tick once per interval', () => {
    jest.useFakeTimers();

    let ticks = 0;
    const loop = new IntervalLoop(1_000, () => undefined);
    loop.start(() => {
      ticks += 1;

      return Promise.resolve();
    });

    jest.advanceTimersByTime(3_000);
    expect(ticks).toBe(3);

    loop.stop();
    jest.useRealTimers();
  });

  it('should ignore start while already running', () => {
    jest.useFakeTimers();

    let ticks = 0;
    const loop = new IntervalLoop(1_000, () => undefined);
    loop.start(() => {
      ticks += 1;

      return Promise.resolve();
    });
    loop.start(() => {
      ticks += 100;

      return Promise.resolve();
    });

    jest.advanceTimersByTime(2_000);
    expect(ticks).toBe(2);

    loop.stop();
    jest.useRealTimers();
  });

  it('should not run ticks after stop', () => {
    jest.useFakeTimers();

    let ticks = 0;
    const loop = new IntervalLoop(1_000, () => undefined);
    loop.start(() => {
      ticks += 1;

      return Promise.resolve();
    });

    jest.advanceTimersByTime(1_000);
    loop.stop();
    jest.advanceTimersByTime(5_000);

    expect(ticks).toBe(1);

    jest.useRealTimers();
  });

  it('should route tick rejections to the error handler', async () => {
    jest.useFakeTimers();

    const errors: unknown[] = [];
    const failure = new Error('tick failed');
    const loop = new IntervalLoop(1_000, (error) => errors.push(error));
    loop.start(() => Promise.reject(failure));

    jest.advanceTimersByTime(1_000);
    await Promise.resolve();

    expect(errors).toEqual([failure]);

    loop.stop();
    jest.useRealTimers();
  });
});
