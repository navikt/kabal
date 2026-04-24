import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { FormatName } from '@/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@/redux-api/oppgaver/queries/history';
import type { FullmektigEvent } from '@/redux-api/server-sent-events/types';
import type { Dispatch } from '@/redux-api/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import {
  type BaseEvent,
  type FullmektigEvent as FullmektigHistoryEvent,
  HistoryEventTypes,
  type IFullmektigEvent,
} from '@/types/oppgavebehandling/response';

export const handlefullmektigEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>, dispatch: Dispatch) =>
  ({ actor, timestamp, part }: FullmektigEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      const fullmektig = draft.prosessfullmektig;

      if (userId !== actor.navIdent) {
        if (part === null) {
          toast.info(
            <InfoToast title="Fullmektig fjernet">{formatEmployeeName(actor)} har fjernet fullmektig.</InfoToast>,
          );
        } else if (fullmektig !== null && part.id !== fullmektig.id) {
          toast.info(
            <InfoToast title="Fullmektig endret">
              {formatEmployeeName(actor)} har endret fullmektig fra <FormatName {...fullmektig} /> til{' '}
              <FormatName {...part} />.
            </InfoToast>,
          );
        } else {
          toast.info(
            <InfoToast title="Fullmektig satt">
              {formatEmployeeName(actor)} har satt fullmektig til <FormatName {...part} />.
            </InfoToast>,
          );
        }
      }

      draft.prosessfullmektig = part;
      draft.modified = timestamp;

      dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const baseEvent: BaseEvent<FullmektigHistoryEvent, HistoryEventTypes.FULLMEKTIG> = {
            actor,
            timestamp,
            event: { part },
            type: HistoryEventTypes.FULLMEKTIG,
          };

          const previous = history.fullmektig.at(-1);

          if (previous === undefined) {
            history.fullmektig = [
              {
                ...baseEvent,
                previous: {
                  actor: null,
                  timestamp,
                  event: { part },
                  type: HistoryEventTypes.FULLMEKTIG,
                },
              },
            ];

            return history;
          }

          const historyEvent: IFullmektigEvent = {
            actor,
            timestamp,
            event: { part },
            type: HistoryEventTypes.FULLMEKTIG,
            previous,
          };

          history.fullmektig = [...history.fullmektig, historyEvent];

          return history;
        }),
      );
    });
  };
