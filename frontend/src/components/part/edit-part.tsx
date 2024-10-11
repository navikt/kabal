import { cleanAndValidate } from '@app/components/part/validate';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useLazySearchpartwithutsendingskanalQuery } from '@app/redux-api/search';
import type { IPart } from '@app/types/oppgave-common';
import { Search, Tag } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { Lookup } from './lookup';

interface EditPartProps {
  onChange: (part: IPart) => void;
  onClose?: () => void;
  isLoading: boolean;
  buttonText?: string;
  autoFocus?: boolean;
  id?: string;
  allowUnreachable?: boolean;
}

export const EditPart = ({ onChange, autoFocus, onClose, id, ...props }: EditPartProps) => {
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
        isSearching={isSearching || isFetching}
        isError={isError}
        {...props}
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
  allowUnreachable?: boolean;
}

const Result = ({ part, search, isError, ...props }: ResultProps) => {
  if (isError) {
    return <Tag variant="warning">Ingen treff</Tag>;
  }

  if (part === undefined || search.length === 0) {
    return null;
  }

  return <Lookup part={part} {...props} />;
};

const StyledEditPart = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
`;
