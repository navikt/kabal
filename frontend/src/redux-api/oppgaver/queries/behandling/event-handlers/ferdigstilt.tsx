import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import type { FerdigstiltEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';

export const handleFerdigstiltEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, avsluttetAvSaksbehandler }: FerdigstiltEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent && draft.avsluttetAvSaksbehandlerDate === null) {
        toast.info(
          <InfoToast title="Behandling ferdigstilt">
            {formatEmployeeName(actor)} har ferdigstilt behandlingen.
          </InfoToast>,
        );
      }

      draft.avsluttetAvSaksbehandlerDate = avsluttetAvSaksbehandler;
      draft.isAvsluttetAvSaksbehandler = true;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          return {
            ...history,
            ferdigstilt: [
              {
                actor,
                timestamp,
                event: { avsluttetAvSaksbehandler },
                type: HistoryEventTypes.FERDIGSTILT,
                previous: history.ferdigstilt.at(0) ?? {
                  actor: null,
                  timestamp: draft.created,
                  event: null,
                  type: HistoryEventTypes.FERDIGSTILT,
                },
              },
            ],
          };
        }),
      );
    });
  };
