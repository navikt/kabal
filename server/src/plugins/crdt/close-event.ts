import type { CloseEvent } from '@hocuspocus/common';
import { isObject } from '@/functions/functions';
import type { ConnectionContext } from '@/plugins/crdt/context';

export const getCloseEvent = (reason: string, code: number): CloseEvent => ({ reason, code });

export const isCloseEvent = (data: unknown): data is CloseEvent =>
  isObject(data) && 'code' in data && typeof data.code === 'number' && 'reason' in data;

/**
 * Closes the WebSocket itself, then returns a `CloseEvent` to throw.
 *
 * Neither of the two ways hocuspocus reacts to a throwing hook actually closes the socket:
 *
 * 1. `onConnect`, `onAuthenticate`, `onLoadDocument` and `connected` run inside a single try/catch
 *    that only replies `permission denied`.
 * 2. A throw from `beforeHandleMessage` reaches `Connection.close()`, which removes the connection
 *    from `Document.connections`, fires the close callbacks and sends a CLOSE *message* - but leaves
 *    the socket open. The client-side provider hardcodes that message to close code 1000, so a
 *    rejected connection looks like a clean shutdown while it silently stops receiving updates.
 *
 * Closing explicitly is the only way to give the client a close code it can act on.
 */
export const closeConnection = (context: ConnectionContext, reason: string, code: number): CloseEvent => {
  context.socket.close(code, reason);

  return getCloseEvent(reason, code);
};
