import type { HighlightStorage } from '@navikt/klage-file-viewer';
import { createHttpHighlightStorage, type HighlightServerEventName } from '@navikt/klage-file-viewer/highlight-storage';
import { getHighlightEventsUrl, getHighlightsUrl } from '#shared/highlights';
import { getHeaders } from '@/headers';
import { ServerSentEventManager, type TracedEvent } from '@/server-sent-events';

/**
 * The user's personal highlights in the behandling, shared between all their viewers.
 * Each viewer needs its own event stream, since the server sends the snapshot only when a stream opens.
 */
export const createKabalHighlightStorage = (behandlingId: string): HighlightStorage =>
  createHttpHighlightStorage({
    getUrl: getHighlightsUrl,
    getHeaders,
    connect: ({ snapshot, added, removed, closed }) => {
      const events = new ServerSentEventManager<HighlightServerEventName>(
        'highlights',
        getHighlightEventsUrl(behandlingId),
      );
      // Called both after `closed` and when the viewer disconnects. Closing twice would end the tracing span twice.
      const disconnected = new AbortController();

      const disconnect = () => {
        if (disconnected.signal.aborted) {
          return;
        }

        disconnected.abort();

        for (const removeListener of removeListeners) {
          removeListener();
        }

        events.close();
      };

      const removeListeners = [
        events.addJsonEventListener<TracedEvent>('snapshot', snapshot),
        events.addJsonEventListener<TracedEvent>('added', added),
        events.addJsonEventListener<TracedEvent>('removed', removed),
        events.addJsonEventListener<TracedEvent>('closed', () => {
          closed();
          // The server ends the stream, and reconnecting would only get `closed` again.
          disconnect();
        }),
      ];

      return disconnect;
    },
  });
