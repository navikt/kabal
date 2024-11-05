import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import type { UtfallEvent } from '@app/redux-api/server-sent-events/types';
import type { UtfallEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Tag } from '@navikt/ds-react';

export const handleUtfallEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, utfallId }: UtfallEvent) => {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        const oldUtfall = draft.resultat.utfallId;

        toast.info(
          <InfoToast title="Utfall endret">
            {formatEmployeeName(actor)} har endret utfall fra:{' '}
            <Tag size="xsmall" variant="alt1">
              {oldUtfall === null ? 'Ikke valgt' : <UtfallName utfall={oldUtfall} />}
            </Tag>{' '}
            til:{' '}
            <Tag size="xsmall" variant="alt1">
              {utfallId === null ? 'Ikke valgt' : <UtfallName utfall={utfallId} />}
            </Tag>
            .
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

const UtfallName = ({ utfall }: { utfall: UtfallEnum }) => {
  const name = useUtfallNameOrLoading(utfall);

  return <>{name}</>;
};
