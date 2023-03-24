import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface Props {
  resetFilters: () => void;
  resetFiltersDisabled: boolean;
  slicedFilteredLength: number;
  filteredLength: number;
  totalLength: number | undefined;
}

export const Header = ({
  resetFilters,
  resetFiltersDisabled,
  filteredLength,
  slicedFilteredLength,
  totalLength = 0,
}: Props) => (
  <Container>
    <Heading
      size="small"
      level="1"
      title={`Viser ${slicedFilteredLength} av ${filteredLength} filtrerte dokumenter. Totalt ${totalLength} dokumenter`}
    >
      Journalførte dokumenter ({filteredLength})
    </Heading>
    <Button
      disabled={resetFiltersDisabled}
      size="small"
      variant="secondary"
      onClick={resetFilters}
      icon={<ArrowCirclepathIcon aria-hidden />}
    >
      Fjern filtere
    </Button>
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
