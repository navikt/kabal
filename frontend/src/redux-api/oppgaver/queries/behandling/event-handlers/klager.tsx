import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import { FormatName } from '@/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@/redux-api/oppgaver/queries/history';
import type { KlagerEvent } from '@/redux-api/server-sent-events/types';
import type { Dispatch } from '@/redux-api/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import {
  type BaseEvent,
  HistoryEventTypes,
  type IKlagerEvent,
  type KlagerEvent as KlagerHistoryEvent,
} from '@/types/oppgavebehandling/response';

export const handleKlagerEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>, dispatch: Dispatch) =>
  ({ actor, timestamp, part }: KlagerEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent && part.id !== draft.klager.id) {
        toast.info(
          <InfoToast title="Klager endret">
            {formatEmployeeName(actor)} har endret klager fra <FormatName {...draft.klager} /> til{' '}
            <FormatName {...part} />.
          </InfoToast>,
        );
      }

      draft.klager = part;
      draft.modified = timestamp;

      dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const baseEvent: BaseEvent<KlagerHistoryEvent, HistoryEventTypes.KLAGER> = {
            actor,
            timestamp,
            event: { part },
            type: HistoryEventTypes.KLAGER,
          };

          const previous = history.klager.at(-1);

          if (previous === undefined) {
            history.klager = [
              {
                ...baseEvent,
                previous: {
                  actor: null,
                  timestamp,
                  event: { part },
                  type: HistoryEventTypes.KLAGER,
                },
              },
            ];

            return history;
          }

          const historyEvent: IKlagerEvent = {
            actor,
            timestamp,
            event: { part },
            type: HistoryEventTypes.KLAGER,
            previous,
          };

          history.klager = [...history.klager, historyEvent];

          return history;
        }),
      );
    });
  };
