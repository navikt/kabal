import { toast } from '@app/components/toast/store';
import { reduxStore } from '@app/redux/configure-store';
import { getRolToastContent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/rol-toast';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import type { RolEvent } from '@app/redux-api/server-sent-events/types';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type IRolEvent } from '@app/types/oppgavebehandling/response';
import { BodyLong } from '@navikt/ds-react';

export const handleRolEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ flowState, actor, timestamp, rol }: RolEvent) => {
    const navIdent = rol?.navIdent ?? null;
    let previousRol: string | null = null;
    let previousFlow = FlowState.NOT_SENT;

    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      previousRol = draft.rol.employee?.navIdent ?? null;
      previousFlow = draft.rol.flowState;

      if (actor.navIdent !== userId) {
        const current = draft.rol;

        const toastContent = getRolToastContent(
          actor,
          userId,
          { flowState: current.flowState, rol: current.employee },
          { flowState, rol },
        );

        if (toastContent !== null) {
          toast.info(<BodyLong size="small">{toastContent}</BodyLong>);
        }
      }

      draft.rol.employee = rol;
      draft.rol.flowState = flowState;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const previous = history.rol.at(-1);

          if (previous === undefined) {
            if (flowState === FlowState.NOT_SENT) {
              return history;
            }

            return {
              ...history,
              rol: [
                {
                  actor,
                  timestamp,
                  event: { flow: flowState, rol },
                  type: HistoryEventTypes.ROL,
                  previous: {
                    actor: null,
                    timestamp,
                    event: { flow: FlowState.NOT_SENT, rol: null },
                    type: HistoryEventTypes.ROL,
                  },
                } satisfies IRolEvent,
              ],
            };
          }

          if (flowState === FlowState.NOT_SENT && previousFlow === FlowState.NOT_SENT) {
            return history;
          }

          if (flowState === previousFlow && navIdent === previousRol) {
            return history;
          }

          return {
            ...history,
            rol: [
              ...history.rol,
              {
                actor,
                timestamp,
                event: { flow: flowState, rol },
                type: HistoryEventTypes.ROL,
                previous,
              } satisfies IRolEvent,
            ],
          };
        }),
      );
    });
  };
