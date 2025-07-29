import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { isoDateToPretty } from '@app/domain/date';
import { reduxStore } from '@app/redux/configure-store';
import { employeeName } from '@app/redux-api/oppgaver/queries/behandling/event-handlers/common';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { historyQuerySlice } from '@app/redux-api/oppgaver/queries/history';
import type { SattPaaVentEvent } from '@app/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { HistoryEventTypes, type ISattPaaVentEvent } from '@app/types/oppgavebehandling/response';
import { Label } from '@navikt/ds-react';

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
              <p className="m-0 p-0">
                {employeeName(actor)} har satt behandlingen på vent til {isoDateToPretty(sattPaaVent.to)}.
              </p>
              <Label size="small" htmlFor={id}>
                Årsak
              </Label>
              <p id={id} className="m-0 border-l border-l-ax-border-neutral-subtle p-0 pl-1 italic">
                {sattPaaVent.reason}
              </p>
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
              ...history.sattPaaVent,
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
              } satisfies ISattPaaVentEvent,
            ],
          };
        }),
      );
    });
  };
