import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { deleteAllDocumentBackupsForBehandling } from '@/localstorage';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@/redux-api/oppgaver/queries/history';
import type { FerdigstiltEvent } from '@/redux-api/server-sent-events/types';
import type { Dispatch } from '@/redux-api/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type IFerdigstiltEvent } from '@/types/oppgavebehandling/response';

export const handleFerdigstiltEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>, dispatch: Dispatch) =>
  ({ actor, timestamp, avsluttetAvSaksbehandler }: FerdigstiltEvent) => {
    // Should be a no-op, as the API requires all documents to be finished or deleted before fullføring. Kept as a cheap safeguard for edge cases.
    deleteAllDocumentBackupsForBehandling(oppgaveId);

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

      dispatch(
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
