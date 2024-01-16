import { Checkbox } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useDocumentsOnlyIncluded } from '@app/hooks/settings/use-setting';

export const IncludedFilter = () => {
  const { value = false, setValue } = useDocumentsOnlyIncluded();

  const title = value ? 'Viser kun inkluderte dokumenter.' : 'Viser alle dokumenter.';

  return (
    <Container>
      <Checkbox size="small" checked={value} hideLabel onChange={() => setValue(!value)} title={title}>
        {title}
      </Checkbox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: ${Fields.Action};
`;
