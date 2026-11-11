import type { HighlightStorage } from '@navikt/klage-file-viewer';
import { createEventSourceConnection, createHttpHighlightStorage } from '@navikt/klage-file-viewer/highlight-storage';
import { getHighlightEventsUrl, getHighlightsUrl } from '#shared/highlights';

/** The user's personal highlights in the behandling, shared between all their viewers. */
export const createHighlightStorage = (behandlingId: string): HighlightStorage =>
  createHttpHighlightStorage({
    getUrl: getHighlightsUrl,
    connect: createEventSourceConnection(getHighlightEventsUrl(behandlingId)),
  });
