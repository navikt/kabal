import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { UtfallTag } from '@/components/utfall-tag/utfall-tag';
import { formatEmployeeName } from '@/domain/employee-name';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { UtfallEvent } from '@/redux-api/server-sent-events/types';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

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
