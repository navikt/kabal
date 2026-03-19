import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { reduxStore } from '@/redux/configure-store';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@/redux-api/oppgaver/queries/history';
import type { FeilregistreringEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type IFeilregistrertEvent } from '@/types/oppgavebehandling/response';

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
            {formatEmployeeName(actor)} har feilregistrert behandlingen.
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
                previous: history.feilregistrert.at(-1) ?? {
                  actor: null,
                  timestamp: draft.created,
                  event: null,
                  type: HistoryEventTypes.FEILREGISTRERT,
                },
              } satisfies IFeilregistrertEvent,
            ],
          };
        }),
      );
    });
  };
