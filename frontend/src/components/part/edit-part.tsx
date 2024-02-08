import { Search, Tag } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { cleanAndValidate } from '@app/components/part/validate';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useLazySearchpartwithutsendingskanalQuery } from '@app/redux-api/search';
import { IPart } from '@app/types/oppgave-common';
import { Lookup } from './lookup';

interface EditPartProps {
  onChange: (part: IPart) => void;
  onClose?: () => void;
  isLoading: boolean;
  buttonText?: string;
  autoFocus?: boolean;
  id?: string;
}

export const EditPart = ({ onChange, isLoading, buttonText, autoFocus, onClose, id }: EditPartProps) => {
  const { data: oppgave } = useOppgave();
  const [rawValue, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [search, { data, isLoading: isSearching, isFetching, isError }] = useLazySearchpartwithutsendingskanalQuery();

  const onClick = () => {
    const [value, inputError] = cleanAndValidate(rawValue);

    setError(inputError);

    if (inputError === undefined && oppgave !== undefined) {
      search({ identifikator: value, sakenGjelderId: oppgave.sakenGjelder.id, ytelseId: oppgave.ytelseId });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (data === undefined) {
        return;
      }

      onChange(data);
      setValue('');

      return;
    }

    if (event.key === 'Escape') {
      onClose?.();
    }
  };

  useEffect(() => {
    const [value, inputError] = cleanAndValidate(rawValue);
    setError(undefined);

    if (inputError === undefined && oppgave !== undefined) {
      search({ identifikator: value, sakenGjelderId: oppgave.sakenGjelder.id, ytelseId: oppgave.ytelseId });
    }
  }, [oppgave, rawValue, search]);

  return (
    <StyledEditPart id={id}>
      <Search
        label="Søk"
        size="small"
        value={rawValue}
        onChange={setValue}
        error={error}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        htmlSize={20}
      >
        <Search.Button onClick={onClick} loading={isSearching || isFetching} />
      </Search>
      <Result
        part={data}
        search={rawValue}
        onChange={(p) => {
          setValue('');
          onChange(p);
        }}
        isLoading={isLoading}
        isSearching={isSearching || isFetching}
        isError={isError}
        buttonText={buttonText}
      />
    </StyledEditPart>
  );
};

interface ResultProps {
  part: IPart | undefined;
  onChange: (part: IPart) => void;
  isLoading: boolean;
  isSearching: boolean;
  isError: boolean;
  search: string;
  buttonText?: string;
}

const Result = ({ part, onChange, search, isError, isLoading, isSearching, buttonText }: ResultProps) => {
  if (isError) {
    return <Tag variant="warning">Ingen treff</Tag>;
  }

  if (part === undefined || search.length === 0) {
    return null;
  }

  return (
    <Lookup isSearching={isSearching} part={part} onChange={onChange} isLoading={isLoading} buttonText={buttonText} />
  );
};

const StyledEditPart = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;
