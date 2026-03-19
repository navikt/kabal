import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { employeeName } from '@/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { TilbakekrevingEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const handleTilbakekrevingEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, tilbakekreving }: TilbakekrevingEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        toast.info(
          <InfoToast title="Tilbakekreving">
            {employeeName(actor)} har satt at det{tilbakekreving ? ' ' : ' ikke '}gjelder en tilbakekrevingssak.
          </InfoToast>,
        );
      }

      draft.tilbakekreving = tilbakekreving;
      draft.modified = timestamp;
    });
  };
