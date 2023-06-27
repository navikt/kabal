import { Search, Tag } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { cleanAndValidate } from '@app/components/part/validate';
import { useLazySearchPartQuery } from '@app/redux-api/oppgaver/mutations/behandling';
import { IPart } from '@app/types/oppgave-common';
import { Lookup } from './lookup';

interface EditPartProps {
  onChange: (part: IPart) => void;
  isLoading: boolean;
}

export const EditPart = ({ onChange, isLoading }: EditPartProps) => {
  const [rawValue, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [search, { data, isLoading: isSearching, isFetching, isError }] = useLazySearchPartQuery();

  const onClick = () => {
    const [value, inputError] = cleanAndValidate(rawValue);

    setError(inputError);

    if (inputError === undefined) {
      search(value);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  useEffect(() => {
    const [value, inputError] = cleanAndValidate(rawValue);
    setError(undefined);

    if (inputError === undefined) {
      search(value);
    }
  }, [rawValue, search]);

  return (
    <StyledEditPart>
      <Search
        label="Søk"
        size="small"
        value={rawValue}
        onChange={setValue}
        error={error}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete="off"
      >
        <Search.Button onClick={onClick} loading={isSearching || isFetching} />
      </Search>
      {isError ? (
        <Tag variant="warning">Ingen treff</Tag>
      ) : (
        <Lookup isSearching={isSearching || isFetching} part={data} onChange={onChange} isLoading={isLoading} />
      )}
    </StyledEditPart>
  );
};

const StyledEditPart = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 16px;
`;
