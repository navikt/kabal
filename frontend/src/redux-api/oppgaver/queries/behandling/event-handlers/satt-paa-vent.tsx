import { Label } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { isoDateToPretty } from '@app/domain/date';
import { reduxStore } from '@app/redux/configure-store';
import { employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import { SattPaaVentEvent } from '@app/redux-api/server-sent-events/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';

export const handleSattPaaVentEvent =
  (oppgaveId: string, userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, sattPaaVent }: SattPaaVentEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        if (sattPaaVent === null) {
          toast.info(
            <InfoToast title="Venteperiode avsluttet">
              {employeeName(actor)} har avsluttet venteperioden for behandlingen.
            </InfoToast>,
          );
        } else {
          const id = `satt-paa-vent-${oppgaveId}-${timestamp}`;
          toast.info(
            <InfoToast title="Behandling satt på vent">
              <Line>
                {employeeName(actor)} har satt behandlingen på vent til {isoDateToPretty(sattPaaVent.to)}.
              </Line>
              <Label size="small" htmlFor={id}>
                Årsak
              </Label>
              <Reason id={id}>{sattPaaVent.reason}</Reason>
            </InfoToast>,
          );
        }
      }

      draft.sattPaaVent = sattPaaVent;
      draft.modified = timestamp;

      reduxStore.dispatch(
        historyQuerySlice.util.updateQueryData('getHistory', oppgaveId, (history) => {
          if (history === undefined) {
            return;
          }

          return {
            ...history,
            sattPaaVent: [
              {
                actor,
                timestamp,
                event: sattPaaVent,
                type: HistoryEventTypes.SATT_PAA_VENT,
                previous: history.sattPaaVent.at(0) ?? {
                  actor: null,
                  timestamp: draft.created,
                  event: null,
                  type: HistoryEventTypes.SATT_PAA_VENT,
                },
              },
              ...history.sattPaaVent,
            ],
          };
        }),
      );
    });
  };

const Line = styled.p`
  margin: 0;
  padding: 0;
`;

const Reason = styled.p`
  margin: 0;
  padding: 0;
  font-style: italic;
  padding-left: 4px;
  border-left: 4px solid var(--a-border-subtle);
`;
