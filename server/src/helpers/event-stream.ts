import { finished, PassThrough, type Readable } from 'node:stream';
import { registerOpenStream } from '@/shutdown';

export const isEventStream = (contentType: unknown): boolean =>
  typeof contentType === 'string' && contentType.split(';')[0]?.trim().toLowerCase() === 'text/event-stream';

/**
 * Wraps an upstream event stream so the response is ended cleanly, instead of cut, when the upstream fails
 * or this server shuts down. Cut responses are logged as "unexpected EOF" by Wonderwall.
 */
export const createGracefulEventStream = (upstream: Readable, onUpstreamError: (error: Error) => void): Readable => {
  const downstream = new PassThrough();
  let ended = false;

  const end = () => {
    if (ended) {
      return;
    }

    ended = true;
    upstream.unpipe(downstream);
    upstream.destroy();
    downstream.end();
  };

  // Covers every way upstream can stop: end, error and close without end (premature close).
  finished(upstream, (error) => {
    if (error !== undefined && error !== null && !ended) {
      onUpstreamError(error);
    }

    end();
  });

  upstream.pipe(downstream);

  // Ends the stream immediately if the server is already shutting down.
  const unregister = registerOpenStream(end);

  // Downstream closes when the response is done or the client disconnects. Stop reading from upstream.
  downstream.on('close', () => {
    ended = true;
    unregister();
    upstream.destroy();
  });

  return downstream;
};
