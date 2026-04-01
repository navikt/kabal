import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { getReduxStore } from '@/redux/store-ref';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@/redux-api/oppgaver/queries/history';
import type { FerdigstiltEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type IFerdigstiltEvent } from '@/types/oppgavebehandling/response';

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

      getReduxStore().dispatch(
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
                previous: history.ferdigstilt.at(-1) ?? {
                  actor: null,
                  timestamp: draft.created,
                  event: null,
                  type: HistoryEventTypes.FERDIGSTILT,
                },
              } satisfies IFerdigstiltEvent,
            ],
          };
        }),
      );
    });
  };
