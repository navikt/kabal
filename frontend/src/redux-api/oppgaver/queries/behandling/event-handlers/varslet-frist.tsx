import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { isoDateToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import type { VarsletFristEvent } from '@app/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const handleVarsletFristEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, varsletFrist }: VarsletFristEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        const from = isoDateToPretty(draft.varsletFrist);
        const to = isoDateToPretty(varsletFrist);

        toast.info(
          <InfoToast title="Mottatt vedtaksintans endret">
            {formatEmployeeName(actor)} endret dato for varslet saksbehandlingstid fra {from} til {to}.
          </InfoToast>,
        );
      }

      draft.varsletFrist = varsletFrist;
      draft.modified = timestamp;
    });
  };
