import { BodyShort, Button, Loader, Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { IPart, IdType } from '@app/types/oppgave-common';

interface LookupProps {
  close: () => void;
  data: IPart | undefined;
  isSearching: boolean;
}

export const Lookup = ({ close, data, isSearching }: LookupProps) => {
  if (isSearching) {
    return <Loader title="Laster..." />;
  }

  if (typeof data === 'undefined') {
    return null;
  }

  return <Result fullmektig={data} close={close} />;
};

interface ResultProps {
  close: () => void;
  fullmektig: IPart;
}

const Result = ({ fullmektig, close }: ResultProps) => {
  const oppgaveId = useOppgaveId();
  const [setFullmektig, { isLoading }] = useUpdateFullmektigMutation();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  const onClick = () => setFullmektig({ fullmektig, oppgaveId }).then(close);

  return (
    <StyledResult variant={fullmektig.type === IdType.FNR ? 'info' : 'warning'}>
      <BodyShort>{fullmektig.name}</BodyShort>
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
