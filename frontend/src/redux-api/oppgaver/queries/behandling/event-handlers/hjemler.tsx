import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { formatEmployeeName } from '@app/domain/employee-name';
import type { UpdateFn } from '@app/redux-api/oppgaver/queries/behandling/types';
import type { HjemlerEvent } from '@app/redux-api/server-sent-events/types';
import { useRegistreringshjemlerMap } from '@app/simple-api-state/use-kodeverk';
import type { INavEmployee } from '@app/types/bruker';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const handleRegistreringshjemlerEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, hjemmelIdSet }: HjemlerEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        toast.info(
          <Toast
            actor={actor}
            oldHjemler={[...draft.resultat.hjemmelIdSet]}
            newHjemler={hjemmelIdSet}
            type="Registreringshjemler"
          />,
        );
      }

      draft.resultat.hjemmelIdSet = hjemmelIdSet;
      draft.modified = timestamp;
    });
  };

export const handleInnsendingshjemlerEvent =
  (userId: string, updateCachedData: UpdateFn<IOppgavebehandling>) =>
  ({ actor, timestamp, hjemmelIdSet }: HjemlerEvent) => {
    updateCachedData((draft) => {
      if (draft === undefined) {
        return draft;
      }

      if (userId !== actor.navIdent) {
        toast.info(
          <Toast
            actor={actor}
            oldHjemler={[...draft.hjemmelIdList]}
            newHjemler={hjemmelIdSet}
            type="Innsendingshjemler"
          />,
        );
      }

      draft.hjemmelIdList = hjemmelIdSet;
      draft.modified = timestamp;
    });
  };

interface Props {
  actor: INavEmployee;
  newHjemler: string[];
  oldHjemler: string[];
  type: 'Registreringshjemler' | 'Innsendingshjemler';
}

const Toast = ({ actor, newHjemler, oldHjemler, type }: Props) => {
  const from =
    oldHjemler.length === 0 ? (
      <Tag size="xsmall" variant="alt1">
        Ingen
      </Tag>
    ) : (
      <HjemmelList hjemler={oldHjemler} />
    );
  const to =
    newHjemler.length === 0 ? (
      <Tag size="xsmall" variant="alt1">
        Ingen
      </Tag>
    ) : (
      <HjemmelList hjemler={newHjemler} />
    );

  return (
    <InfoToast title={`${type} endret`}>
      <div>
        {formatEmployeeName(actor)} har endret {type.toLowerCase()} fra:
      </div>
      {from}
      <div>til:</div>
      {to}
    </InfoToast>
  );
};

const HjemmelList = ({ hjemler }: { hjemler: string[] }) => {
  const { data: hjemmelMap } = useRegistreringshjemlerMap();

  return (
    <TagContainer>
      {hjemler.map((hjemmel) => (
        <Tag key={hjemmel} size="xsmall" variant="alt1">
          {hjemmelMap?.[hjemmel]?.hjemmelnavn ?? hjemmel}
        </Tag>
      ))}
    </TagContainer>
  );
};

const TagContainer = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-spacing-1);
`;
