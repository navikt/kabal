import { BodyLong } from '@navikt/ds-react';
import React from 'react';
import { toast } from '@app/components/toast/store';
import { reduxStore } from '@app/redux/configure-store';
import { getMedunderskriverToastContent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/medunderskriver-toast';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import { MedunderskriverEvent } from '@app/redux-api/server-sent-events/types';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';

export const handleMedunderskriverEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ flowState, navIdent, actor, timestamp }: MedunderskriverEvent) => {
    let previousMedunderskriver: string | null = null;
    let previousFlow = FlowState.NOT_SENT;

    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      previousMedunderskriver = draft.medunderskriver.navIdent;
      previousFlow = draft.medunderskriver.flowState;

      if (actor.navIdent !== userId) {
        const toastContent = getMedunderskriverToastContent(
          actor,
          { flowState: previousFlow, navIdent: previousMedunderskriver },
          { flowState, navIdent },
        );

        if (toastContent !== null) {
          toast.info(<BodyLong size="small">{toastContent}</BodyLong>);
        }
      }

      draft.medunderskriver.navIdent = navIdent;
      draft.medunderskriver.flowState = flowState;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const previous = history.medunderskriver.at(0);

          if (previous === undefined) {
            if (flowState === FlowState.NOT_SENT) {
              return history;
            }

            return {
              ...history,
              medunderskriver: [
                {
                  actor: actor.navIdent,
                  timestamp,
                  event: { flow: flowState, medunderskriver: navIdent },
                  type: HistoryEventTypes.MEDUNDERSKRIVER,
                  previous: {
                    actor: null,
                    timestamp,
                    event: { flow: FlowState.NOT_SENT, medunderskriver: null },
                    type: HistoryEventTypes.MEDUNDERSKRIVER,
                  },
                },
              ],
            };
          }

          if (flowState === FlowState.NOT_SENT && previousFlow === FlowState.NOT_SENT) {
            return history;
          }

          if (flowState === previousFlow && navIdent === previousMedunderskriver) {
            return history;
          }

          return {
            ...history,
            medunderskriver: [
              {
                actor: actor.navIdent,
                timestamp,
                event: { flow: flowState, medunderskriver: navIdent },
                type: HistoryEventTypes.MEDUNDERSKRIVER,
                previous,
              },
              ...history.medunderskriver,
            ],
          };
        }),
      );
    });
  };
