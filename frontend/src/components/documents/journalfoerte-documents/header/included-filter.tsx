import { Checkbox } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useDocumentsOnlyIncluded } from '@app/hooks/settings/use-setting';

export const IncludedFilter = () => {
  const { value = false, setValue, isLoading } = useDocumentsOnlyIncluded();

  if (isLoading) {
    return null;
  }

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
`;
