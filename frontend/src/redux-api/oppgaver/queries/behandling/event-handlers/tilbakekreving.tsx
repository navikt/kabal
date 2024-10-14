import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import type { TilbakekrevingEvent } from '@app/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

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
