import React from 'react';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { reduxStore } from '@app/redux/configure-store';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import { FeilregistreringEvent } from '@app/redux-api/server-sent-events/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';

export const handleFeilregistreringEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, reason, registered, fagsystemId }: FeilregistreringEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent && draft.feilregistrering === null) {
        toast.info(
          <InfoToast title="Behandling feilregistrert">
            {actor.navn} har feilregistrert behandlingen.
            {reason}
          </InfoToast>,
        );
      }

      draft.feilregistrering = { reason, registered, fagsystemId, feilregistrertAv: actor };
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          return {
            ...history,
            feilregistrert: [
              {
                actor,
                timestamp,
                event: { reason },
                type: HistoryEventTypes.FEILREGISTRERT,
                previous: history.feilregistrert.at(0) ?? {
                  actor: null,
                  timestamp: draft.created,
                  event: null,
                  type: HistoryEventTypes.FEILREGISTRERT,
                },
              },
            ],
          };
        }),
      );
    });
  };
