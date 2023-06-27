import { BodyShort, Button, Loader, Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
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
  <StyledResult variant={part.type === IdType.FNR ? 'info' : 'warning'} size="medium">
    <BodyShort>
      {part.name} ({part.type === IdType.FNR ? formatFoedselsnummer(part.id) : formatOrgNum(part.id)})
    </BodyShort>
    {part.available ? (
      <Button onClick={() => onChange(part)} loading={isLoading} size="small" variant="secondary">
        Bruk
      </Button>
    ) : (
      <Tag variant="error" size="small">
        Ikke tilgjengelig
      </Tag>
    )}
  </StyledResult>
);

const StyledResult = styled(Tag)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;
