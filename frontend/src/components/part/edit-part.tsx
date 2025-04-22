import { cleanAndValidate } from '@app/components/part/validate';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useLazySearchpartwithutsendingskanalQuery } from '@app/redux-api/search';
import { isApiDataError } from '@app/types/errors';
import type { IPart } from '@app/types/oppgave-common';
import { Alert, Search, Tag, VStack } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useState } from 'react';
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
  const [inputError, setInputError] = useState<string>();
  const [search, { data, isLoading, isFetching, isError, error }] = useLazySearchpartwithutsendingskanalQuery();

  if (oppgave === undefined) {
    return null;
  }

  const onSearchChange = (value: string) => {
    const [identifikator, validationError] = cleanAndValidate(value);

    if (validationError !== undefined) {
      return;
    }

    const { ytelseId } = oppgave;

    search({ identifikator, sakenGjelderId: oppgave.sakenGjelder.identifikator, ytelseId });
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

  const isSearching = isLoading || isFetching;

  return (
    <VStack gap="2 0" id={id}>
      <Search
        label="Søk"
        size="small"
        value={rawValue}
        onChange={(v) => {
          setValue(v);
          onSearchChange(v);
        }}
        error={inputError}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        htmlSize={20}
      >
        <Search.Button
          onClick={() => {
            const [, validationError] = cleanAndValidate(rawValue);

            if (validationError !== undefined) {
              return setInputError(validationError);
            }

            onSearchChange(rawValue);
          }}
          loading={isSearching}
        />
      </Search>
      <Result
        part={data}
        search={rawValue}
        onChange={(p) => {
          setValue('');
          onChange(p);
        }}
        isSearching={isSearching}
        isError={isError}
        error={error}
        {...props}
      />
    </VStack>
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
  error: SerializedError | FetchBaseQueryError | undefined;
}

const Result = ({ part, search, isError, error, ...props }: ResultProps) => {
  if (isApiDataError(error)) {
    return (
      <Alert variant="warning" size="small">
        {error.data.title}
      </Alert>
    );
  }

  if (isError) {
    return <Tag variant="warning">Ingen treff</Tag>;
  }

  if (part === undefined || search.length === 0) {
    return null;
  }

  return <Lookup part={part} {...props} />;
};
