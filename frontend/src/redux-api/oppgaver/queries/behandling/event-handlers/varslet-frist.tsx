import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { isoDateToPretty } from '@/domain/date';
import { formatEmployeeName } from '@/domain/employee-name';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { VarsletFristEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const handleVarsletFristEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, varsletFrist, timesPreviouslyExtended }: VarsletFristEvent) => {
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
      draft.timesPreviouslyExtended = timesPreviouslyExtended;
      draft.modified = timestamp;
    });
  };
