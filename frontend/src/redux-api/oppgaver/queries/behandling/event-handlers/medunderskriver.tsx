import { BodyLong } from '@navikt/ds-react';
import { toast } from '@/components/toast/store';
import { reduxStore } from '@/redux/configure-store';
import { getMedunderskriverToastContent } from '@/redux-api/oppgaver/queries/behandling/event-handlers/medunderskriver-toast';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@/redux-api/oppgaver/queries/history';
import type { MedunderskriverEvent } from '@/redux-api/server-sent-events/types';
import type { INavEmployee } from '@/types/bruker';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type IMedunderskriverEvent } from '@/types/oppgavebehandling/response';

export const handleMedunderskriverEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ flowState, actor, timestamp, medunderskriver }: MedunderskriverEvent) => {
    let previousMedunderskriver: INavEmployee | null = null;
    let previousFlow = FlowState.NOT_SENT;

    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      previousMedunderskriver = draft.medunderskriver.employee;
      previousFlow = draft.medunderskriver.flowState;

      if (actor.navIdent !== userId) {
        const toastContent = getMedunderskriverToastContent(
          actor,
          { flowState: previousFlow, medunderskriver: previousMedunderskriver },
          { flowState, medunderskriver },
        );

        if (toastContent !== null) {
          toast.info(<BodyLong size="small">{toastContent}</BodyLong>);
        }
      }

      draft.medunderskriver.employee = medunderskriver;
      draft.medunderskriver.flowState = flowState;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const previous = history.medunderskriver.at(-1);

          if (previous === undefined) {
            if (flowState === FlowState.NOT_SENT) {
              return history;
            }

            return {
              ...history,
              medunderskriver: [
                {
                  actor,
                  timestamp,
                  event: { flow: flowState, medunderskriver },
                  type: HistoryEventTypes.MEDUNDERSKRIVER,
                  previous: {
                    actor: null,
                    timestamp,
                    event: { flow: FlowState.NOT_SENT, medunderskriver: null },
                    type: HistoryEventTypes.MEDUNDERSKRIVER,
                  },
                } satisfies IMedunderskriverEvent,
              ],
            };
          }

          if (flowState === FlowState.NOT_SENT && previousFlow === FlowState.NOT_SENT) {
            return history;
          }

          if (flowState === previousFlow && medunderskriver?.navIdent === previousMedunderskriver?.navIdent) {
            return history;
          }

          return {
            ...history,
            medunderskriver: [
              ...history.medunderskriver,
              {
                actor,
                timestamp,
                event: { flow: flowState, medunderskriver },
                type: HistoryEventTypes.MEDUNDERSKRIVER,
                previous,
              } satisfies IMedunderskriverEvent,
            ],
          };
        }),
      );
    });
  };
