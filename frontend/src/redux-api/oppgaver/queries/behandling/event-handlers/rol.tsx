import { BodyLong } from '@navikt/ds-react';
import React from 'react';
import { toast } from '@app/components/toast/store';
import { reduxStore } from '@app/redux/configure-store';
import { getRolToastContent } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/rol-toast';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import { RolEvent } from '@app/redux-api/server-sent-events/types';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';

export const handleRolEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ flowState, navIdent, actor, timestamp }: RolEvent) => {
    let previousRol: string | null = null;
    let previousFlow = FlowState.NOT_SENT;

    updateCachedData((draft) => {
      if (draft === undefined || draft.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
        return draft;
      }

      previousRol = draft.rol.navIdent;
      previousFlow = draft.rol.flowState;

      if (actor.navIdent !== userId) {
        const current = draft.rol;

        const toastContent = getRolToastContent(
          actor,
          { flowState: current.flowState, navIdent: current.navIdent },
          { flowState, navIdent },
        );

        if (toastContent !== null) {
          toast.info(<BodyLong size="small">{toastContent}</BodyLong>);
        }
      }

      draft.rol.navIdent = navIdent;
      draft.rol.flowState = flowState;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          const previous = history.rol.at(0);

          if (previous === undefined) {
            if (flowState === FlowState.NOT_SENT) {
              return history;
            }

            return {
              ...history,
              rol: [
                {
                  actor: actor.navIdent,
                  timestamp,
                  event: { flow: flowState, rol: navIdent },
                  type: HistoryEventTypes.ROL,
                  previous: {
                    actor: null,
                    timestamp,
                    event: { flow: FlowState.NOT_SENT, rol: null },
                    type: HistoryEventTypes.ROL,
                  },
                },
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
              {
                actor: actor.navIdent,
                timestamp,
                event: { flow: flowState, rol: navIdent },
                type: HistoryEventTypes.ROL,
                previous,
              },
              ...history.rol,
            ],
          };
        }),
      );
    });
  };
