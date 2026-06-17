import { describe, expect, test } from 'bun:test';
import { ListenerMap } from '@/document-access/listener-map';

const noop = () => undefined;

describe('ListenerMap', () => {
  test('should remove the key when its last listener is removed', () => {
    const listeners = new ListenerMap<() => void>();

    listeners.add('key', noop);
    listeners.remove('key', noop);

    expect(listeners.has('key')).toBe(false);
    expect(listeners.get('key')).toBeUndefined();
  });

  test('should keep the key while other listeners remain', () => {
    const listeners = new ListenerMap<() => void>();
    const first = () => undefined;
    const second = () => undefined;

    listeners.add('key', first);
    listeners.add('key', second);
    listeners.remove('key', first);

    expect(listeners.has('key')).toBe(true);
    expect(listeners.get('key')).toEqual([second]);
  });

  test('should be a no-op when removing from an unknown key', () => {
    const listeners = new ListenerMap<() => void>();

    expect(() => listeners.remove('missing', noop)).not.toThrow();
    expect(listeners.has('missing')).toBe(false);
  });

  test('should be a no-op when removing an already-removed listener', () => {
    const listeners = new ListenerMap<() => void>();

    listeners.add('key', noop);
    listeners.remove('key', noop);
    listeners.remove('key', noop);

    expect(listeners.has('key')).toBe(false);
  });

  test('should remove exactly the listener via the returned unsubscribe', () => {
    const listeners = new ListenerMap<() => void>();
    const first = () => undefined;
    const second = () => undefined;

    const unsubscribeFirst = listeners.add('key', first);
    listeners.add('key', second);

    unsubscribeFirst();

    expect(listeners.get('key')).toEqual([second]);
  });

  test('should drop every listener under a key on delete', () => {
    const listeners = new ListenerMap<() => void>();

    listeners.add('key', () => undefined);
    listeners.add('key', () => undefined);
    listeners.delete('key');

    expect(listeners.has('key')).toBe(false);
  });

  test('should expose only keys that currently have listeners', () => {
    const listeners = new ListenerMap<() => void>();
    const transient = () => undefined;

    listeners.add('kept', noop);
    listeners.add('transient', transient);
    listeners.remove('transient', transient);

    expect(listeners.keys().toArray()).toEqual(['kept']);
  });
});
