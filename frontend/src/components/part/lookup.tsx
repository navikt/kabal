import { BodyShort, Button, Loader, Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { IPart, IdType } from '@app/types/oppgave-common';

interface LookupProps extends Omit<ResultProps, 'part'> {
  part: IPart | undefined;
  isSearching: boolean;
}

export const Lookup = ({ part, isSearching, ...rest }: LookupProps) => {
  if (isSearching) {
    return <Loader title="Laster..." />;
  }

  if (typeof part === 'undefined') {
    return null;
  }

  return <Result part={part} {...rest} />;
};

interface ResultProps {
  part: IPart;
  onChange: (part: IPart) => void;
  isLoading: boolean;
}

const Result = ({ part, isLoading, onChange }: ResultProps) => (
  <StyledResult variant={part.type === IdType.FNR ? 'info' : 'warning'}>
    <BodyShort>{part.name}</BodyShort>
    <Button onClick={() => onChange(part)} loading={isLoading} size="small" variant="tertiary">
      Bruk
    </Button>
  </StyledResult>
);

const StyledResult = styled(Tag)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;
