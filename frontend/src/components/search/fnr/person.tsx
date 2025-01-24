import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { ErrorAlert } from '@app/components/search/common/error-alert';
import { StyledFnr, StyledName } from '@app/components/search/common/styled-components';
import { formatFoedselsnummer } from '@app/functions/format-id';
import type { staggeredBaseQuery } from '@app/redux-api/common';
import type { SearchPersonResponse } from '@app/types/oppgave-common';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button, Skeleton } from '@navikt/ds-react';
import type { TypedUseQueryHookResult } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';

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
      <SkeletonContainer>
        <Skeleton height={32} width={200} />
        <Skeleton height={32} width={100} />
        <Skeleton height={32} width={80} />
      </SkeletonContainer>
    );
  }

  if (error !== undefined) {
    return (
      <StyledPerson>
        <ErrorAlert error={error} refetch={refetch} isFetching={isFetching}>
          {`Fant ingen person med ID-nummer ${formatFoedselsnummer(fnr)}`}
        </ErrorAlert>
      </StyledPerson>
    );
  }

  if (data === undefined) {
    return null;
  }

  return (
    <StyledPerson data-testid="search-result-person">
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
    </StyledPerson>
  );
};

const StyledPerson = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-4);
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
`;

const SkeletonContainer = styled.div`
  display: flex;
  gap: var(--a-spacing-4);
  margin-left: var(--a-spacing-4);
`;
