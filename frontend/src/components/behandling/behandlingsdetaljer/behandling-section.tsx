import { Label } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface Props {
  label: string;
  children: React.ReactNode;
}

export const BehandlingSection = ({ label, children }: Props) => {
  const id = 'behandling-section-' + label.toLowerCase().replaceAll(/\s/g, '-');

  return (
    <StyledBehandlingSection>
      <Label htmlFor={id} size="small">
        {label}:
      </Label>
      <div id={id}>{children}</div>
    </StyledBehandlingSection>
  );
};

const StyledBehandlingSection = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
