import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { UtfallTag } from '@app/components/utfall-tag/utfall-tag';
import { formatEmployeeName } from '@app/domain/employee-name';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import type { UtfallEvent } from '@app/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const handleUtfallEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, utfallId }: UtfallEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        const oldUtfall = draft.resultat.utfallId;

        toast.info(
          <InfoToast title="Utfall endret">
            {formatEmployeeName(actor)} har endret utfall fra:{' '}
            <UtfallTag utfallId={oldUtfall} size="xsmall" fallback="Ikke valgt" /> til:{' '}
            <UtfallTag utfallId={utfallId} size="xsmall" fallback="Ikke valgt" />.
          </InfoToast>,
        );
      }

      if (utfallId === null) {
        draft.resultat.extraUtfallIdSet = [];
      }

      draft.resultat.utfallId = utfallId;
      draft.modified = timestamp;
    });
  };
