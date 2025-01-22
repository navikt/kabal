import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { FormatName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import type { KlagerEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import {
  type BaseEvent,
  HistoryEventTypes,
  type IKlagerEvent,
  type KlagerEvent as KlagerHistoryEvent,
} from '@app/types/oppgavebehandling/response';

export const handleKlagerEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
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

      reduxStore.dispatch(
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
