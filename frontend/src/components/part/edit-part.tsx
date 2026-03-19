import { Search, Tag, VStack } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useState } from 'react';
import { Alert } from '@/components/alert/alert';
import { Lookup } from '@/components/part/lookup';
import { cleanAndValidate } from '@/components/part/validate';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { Keys } from '@/keys';
import { useLazySearchpartwithutsendingskanalQuery } from '@/redux-api/search';
import { isApiDataError } from '@/types/errors';
import type { IdentifikatorPart } from '@/types/oppgave-common';

export interface InvalidReceiver {
  id: string;
  message: string;
}

interface EditPartProps {
  onChange: (part: IdentifikatorPart) => void;
  onClose?: () => void;
  isLoading: boolean;
  buttonText?: string;
  autoFocus?: boolean;
  id?: string;
  allowUnreachable?: boolean;
  validate?: (part: IdentifikatorPart) => string | null;
  invalidReceivers?: InvalidReceiver[];
  warningReceivers?: InvalidReceiver[];
}

export const EditPart = ({
  onChange,
  autoFocus,
  onClose,
  id,
  invalidReceivers = [],
  warningReceivers = [],
  ...props
}: EditPartProps) => {
  const { data: oppgave } = useOppgave();
  const [rawValue, setValue] = useState('');
  const [inputError, setInputError] = useState<string>();
  const [invalidReceiver, setInvalidReceiver] = useState<InvalidReceiver | null>(null);
  const [warningReceiver, setWarningReceiver] = useState<InvalidReceiver | null>(null);
  const [search, { data, isLoading, isFetching, isError, error }] = useLazySearchpartwithutsendingskanalQuery();

  if (oppgave === undefined) {
    return null;
  }

  const onSearchChange = (value: string) => {
    setInvalidReceiver(null);
    setWarningReceiver(null);

    const [identifikator, validationError] = cleanAndValidate(value);

    if (validationError !== undefined) {
      return;
    }

    const invalidReceiver = invalidReceivers.find((r) => r.id === identifikator);

    if (invalidReceiver !== undefined) {
      setInvalidReceiver(invalidReceiver);
      return;
    }

    const warningReceiver = warningReceivers.find((r) => r.id === identifikator);

    if (warningReceiver !== undefined) {
      setWarningReceiver(warningReceiver);
    }

    const { ytelseId, sakenGjelder } = oppgave;

    search({ identifikator, sakenGjelderId: sakenGjelder.identifikator, ytelseId });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keys.Enter) {
      if (data === undefined) {
        return;
      }

      onChange(data);
      setValue('');

      return;
    }

    if (event.key === Keys.Escape) {
      onClose?.();
    }
  };

  const isSearching = isLoading || isFetching;

  return (
    <VStack gap="space-16 space-0" id={id}>
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

      {warningReceiver !== null ? <Alert variant="info">{warningReceiver.message}</Alert> : null}

      {invalidReceiver === null ? (
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
      ) : (
        <Alert variant="warning">{invalidReceiver.message}</Alert>
      )}
    </VStack>
  );
};

interface ResultProps {
  part: IdentifikatorPart | undefined;
  onChange: (part: IdentifikatorPart) => void;
  isLoading: boolean;
  isSearching: boolean;
  isError: boolean;
  search: string;
  buttonText?: string;
  allowUnreachable?: boolean;
  error: SerializedError | FetchBaseQueryError | undefined;
  validate?: (part: IdentifikatorPart) => string | null;
}

const Result = ({ part, search, isError, error, ...props }: ResultProps) => {
  if (isApiDataError(error)) {
    return <Alert variant="warning">{error.data.title}</Alert>;
  }

  if (isError) {
    return (
      <Tag data-color="warning" variant="outline">
        Ingen treff
      </Tag>
    );
  }

  if (part === undefined || search.length === 0) {
    return null;
  }

  return <Lookup part={part} {...props} />;
};
