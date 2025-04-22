import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { ErrorAlert } from '@app/components/search/common/error-alert';
import { StyledFnr, StyledName } from '@app/components/search/common/styled-components';
import { formatFoedselsnummer } from '@app/functions/format-id';
import type { staggeredBaseQuery } from '@app/redux-api/common';
import type { SearchPersonResponse } from '@app/types/oppgave-common';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button, HStack, Skeleton } from '@navikt/ds-react';
import type { TypedUseQueryHookResult } from '@reduxjs/toolkit/query/react';

// https://github.com/reduxjs/redux-toolkit/issues/1937#issuecomment-1842868277
// https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-query-and-mutation-endpoints
export type PersonHookResult = TypedUseQueryHookResult<
  SearchPersonResponse,
  string,
  ReturnType<typeof staggeredBaseQuery>
>;
export type PersonQuery = Omit<PersonHookResult, 'refetch'> & { refetch: () => void };

type PersonProps = PersonQuery & { fnr: string };

export const Person = ({ data, isLoading, isFetching, error, fnr, refetch }: PersonProps) => {
  if (isLoading) {
    return (
      <HStack gap="4" marginInline="4 0">
        <Skeleton height={32} width={200} />
        <Skeleton height={32} width={100} />
        <Skeleton height={32} width={80} />
      </HStack>
    );
  }

  if (error !== undefined) {
    return (
      <HStack align="center" gap="0 4" paddingInline="4">
        <ErrorAlert error={error} refetch={refetch} isFetching={isFetching}>
          {`Kunne ikke hente person med ID-nummer ${formatFoedselsnummer(fnr)}`}
        </ErrorAlert>
      </HStack>
    );
  }

  if (data === undefined) {
    return null;
  }

  return (
    <HStack align="center" gap="0 4" paddingInline="4" data-testid="search-result-person">
      <StyledName>{data.name}</StyledName>
      <StyledFnr>
        <CopyIdButton id={data.id} />
      </StyledFnr>
      <Button
        variant="secondary"
        size="small"
        onClick={refetch}
        loading={isFetching}
        icon={<MagnifyingGlassIcon aria-hidden />}
      >
        Søk på nytt
      </Button>
    </HStack>
  );
};
