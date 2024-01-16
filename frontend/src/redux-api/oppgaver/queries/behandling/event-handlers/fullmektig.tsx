import React from 'react';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { reduxStore } from '@app/redux/configure-store';
import { FormatName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import { FullmektigEvent } from '@app/redux-api/server-sent-events/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import {
  BaseEvent,
  FullmektigEvent as FullmektigHistoryEvent,
  HistoryEventTypes,
  IFullmektigEvent,
} from '@app/types/oppgavebehandling/response';

export const handlefullmektigEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, part }: FullmektigEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      const fullmektig = draft.prosessfullmektig;

      if (userId !== actor.navIdent) {
        if (part === null) {
          toast.info(<InfoToast title="Fullmektig fjernet">{actor.navn} har fjernet fullmektig.</InfoToast>);
        } else if (fullmektig !== null && part.id !== fullmektig.id) {
          toast.info(
            <InfoToast title="Fullmektig endret">
              {actor.navn} har endret fullmektig fra <FormatName {...fullmektig} /> til <FormatName {...part} />.
            </InfoToast>,
          );
        } else {
          toast.info(
            <InfoToast title="Fullmektig satt">
              {actor.navn} har satt fullmektig til <FormatName {...part} />.
            </InfoToast>,
          );
        }
      }

      draft.prosessfullmektig = part;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const baseEvent: BaseEvent<FullmektigHistoryEvent, HistoryEventTypes.FULLMEKTIG> = {
            actor: actor.navIdent,
            timestamp,
            event: { part },
            type: HistoryEventTypes.FULLMEKTIG,
          };

          const previous = history.fullmektig.at(0);

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
            actor: actor.navIdent,
            timestamp,
            event: { part },
            type: HistoryEventTypes.FULLMEKTIG,
            previous,
          };

          history.fullmektig = [historyEvent, ...history.fullmektig];

          return history;
        }),
      );
    });
  };
