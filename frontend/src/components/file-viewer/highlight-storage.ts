import type { HighlightStorage } from '@navikt/klage-file-viewer';
import { createHttpHighlightStorage, type HighlightServerEventName } from '@navikt/klage-file-viewer/highlight-storage';
import { getHighlightEventsUrl, getHighlightsUrl } from '#shared/highlights';
import { getHeaders } from '@/headers';
import { ServerSentEventManager, type TracedEvent } from '@/server-sent-events';

/**
 * The user's personal highlights in the behandling, shared between all their viewers.
 * Viewers in the same tab share one event stream, so only the first gets the snapshot. Use one viewer per behandling.
 */
export const createKabalHighlightStorage = (behandlingId: string): HighlightStorage =>
  createHttpHighlightStorage({
    getUrl: getHighlightsUrl,
    getHeaders,
    connect: ({ snapshot, added, removed, closed }) => {
      const events = ServerSentEventManager.get<HighlightServerEventName>(
        'highlights',
        getHighlightEventsUrl(behandlingId),
      );
      // `close` releases a shared stream, so it must run once.
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
