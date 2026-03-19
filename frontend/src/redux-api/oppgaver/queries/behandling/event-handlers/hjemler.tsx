import { HStack, Tag } from '@navikt/ds-react';
import { InfoToast } from '@/components/toast/info-toast';
import { toast } from '@/components/toast/store';
import { formatEmployeeName } from '@/domain/employee-name';
import type { UpdateFn } from '@/redux-api/oppgaver/queries/behandling/types';
import type { HjemlerEvent } from '@/redux-api/server-sent-events/types';
import { useRegistreringshjemlerMap } from '@/simple-api-state/use-kodeverk';
import type { INavEmployee } from '@/types/bruker';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

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
      <Tag data-color="meta-purple" size="xsmall" variant="outline">
        Ingen
      </Tag>
    ) : (
      <HjemmelList hjemler={oldHjemler} />
    );
  const to =
    newHjemler.length === 0 ? (
      <Tag data-color="meta-purple" size="xsmall" variant="outline">
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
    <HStack as="span" gap="space-4" wrap>
      {hjemler.map((hjemmel) => (
        <Tag data-color="meta-purple" key={hjemmel} size="xsmall" variant="outline">
          {hjemmelMap?.[hjemmel]?.hjemmelnavn ?? hjemmel}
        </Tag>
      ))}
    </HStack>
  );
};
