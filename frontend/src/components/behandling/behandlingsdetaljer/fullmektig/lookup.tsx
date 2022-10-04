import { BodyShort, Button, Loader, Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { getFullName, getOrgName } from '../../../../domain/name';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateFullmektigMutation } from '../../../../redux-api/oppgaver/mutations/behandling';
import { ISakspart } from '../../../../types/oppgavebehandling/oppgavebehandling';

interface LookupProps {
  close: () => void;
  data: ISakspart | undefined;
  isSearching: boolean;
}

export const Lookup = ({ close, data, isSearching }: LookupProps) => {
  if (isSearching) {
    return <Loader title="Laster..." />;
  }

  if (typeof data === 'undefined') {
    return null;
  }

  if (data.person !== null) {
    return <Result close={close} name={getFullName(data.person.navn)} fullmektig={data} type={FullmaktType.PERSON} />;
  }

  if (data.virksomhet !== null) {
    return (
      <Result close={close} name={getOrgName(data.virksomhet.navn)} fullmektig={data} type={FullmaktType.VIRKSOMHET} />
    );
  }

  return <span>Ingen treff</span>;
};

enum FullmaktType {
  PERSON = 'PERSON',
  VIRKSOMHET = 'VIRKSOMHET',
}

interface ResultProps {
  name: string;
  fullmektig: ISakspart;
  close: () => void;
  type: FullmaktType;
}

const Result = ({ name, fullmektig, close, type }: ResultProps) => {
  const oppgaveId = useOppgaveId();
  const [setFullmektig, { isLoading }] = useUpdateFullmektigMutation();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  const onClick = () => setFullmektig({ fullmektig, oppgaveId }).then(close);

  return (
    <StyledResult variant={type === FullmaktType.PERSON ? 'info' : 'warning'}>
      <BodyShort>{name}</BodyShort>
      <Button onClick={onClick} loading={isLoading} size="small" variant="tertiary">
        Bruk
      </Button>
    </StyledResult>
  );
};

const StyledResult = styled(Tag)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;
