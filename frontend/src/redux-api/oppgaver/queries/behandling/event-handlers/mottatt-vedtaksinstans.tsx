import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { isoDateToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import { MottattVedtaksinstansEvent } from '@app/redux-api/server-sent-events/types';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

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
