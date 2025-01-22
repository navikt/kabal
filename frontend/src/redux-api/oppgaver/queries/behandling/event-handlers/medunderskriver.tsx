import { toast } from '@app/components/toast/store';
import { getMedunderskriverToastContent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/medunderskriver-toast';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import type { MedunderskriverEvent } from '@app/redux-api/server-sent-events/types';
import { reduxStore } from '@app/redux/configure-store';
import type { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type IMedunderskriverEvent } from '@app/types/oppgavebehandling/response';
import { BodyLong } from '@navikt/ds-react';

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
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
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
