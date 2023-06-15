import { Checkbox } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useDocumentsFilterIncluded } from '@app/hooks/settings/use-setting';
import { IncludedDocumentFilter } from '@app/types/documents/documents';

export const IncludedFilter = () => {
  const { value = IncludedDocumentFilter.ALL, setValue, isLoading } = useDocumentsFilterIncluded();

  if (isLoading) {
    return null;
  }

  return (
    <Container>
      <Checkbox
        size="small"
        indeterminate={value === IncludedDocumentFilter.ALL}
        checked={value === IncludedDocumentFilter.INCLUDED}
        hideLabel
        onChange={() => setValue(nextFilter(value))}
        title={getTitle(value)}
      >
        Filtrer på inkluderte dokumenter
      </Checkbox>
    </Container>
  );
};

const nextFilter = (filter: IncludedDocumentFilter): IncludedDocumentFilter => {
  switch (filter) {
    case IncludedDocumentFilter.INCLUDED:
      return IncludedDocumentFilter.EXCLUDED;
    case IncludedDocumentFilter.EXCLUDED:
      return IncludedDocumentFilter.ALL;
    case IncludedDocumentFilter.ALL:
      return IncludedDocumentFilter.INCLUDED;
  }
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const getTitle = (filter: IncludedDocumentFilter) => {
  switch (filter) {
    case IncludedDocumentFilter.INCLUDED:
      return 'Viser kun inkluderte dokumenter.';
    case IncludedDocumentFilter.EXCLUDED:
      return 'Viser kun dokumenter som ikke er inkludert.';
    case IncludedDocumentFilter.ALL:
      return 'Viser alle dokumenter.';
  }
};
