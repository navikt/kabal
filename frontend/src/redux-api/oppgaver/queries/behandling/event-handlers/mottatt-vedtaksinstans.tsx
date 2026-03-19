import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { isoDateToPretty } from '@/domain/date';
import { formatEmployeeName } from '@/domain/employee-name';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { MottattVedtaksinstansEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const handleMottattVedtaksinstansEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, mottattVedtaksinstans }: MottattVedtaksinstansEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        const from = isoDateToPretty(draft.mottattVedtaksinstans);
        const to = isoDateToPretty(mottattVedtaksinstans);

        toast.info(
          <InfoToast title="Mottatt vedtaksintans endret">
            {formatEmployeeName(actor)} endret dato for mottatt vedtaksinstans fra {from} til {to}.
          </InfoToast>,
        );
      }

      draft.mottattVedtaksinstans = mottattVedtaksinstans;
      draft.modified = timestamp;
    });
  };
