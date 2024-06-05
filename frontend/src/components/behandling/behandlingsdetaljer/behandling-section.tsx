import { Label } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  label?: string;
  children: React.ReactNode;
  testid?: string;
}

export const BehandlingSection = ({ label, children, testid }: Props) => {
  if (typeof label === 'undefined') {
    return <StyledBehandlingSection data-testid={testid}>{children}</StyledBehandlingSection>;
  }

  const id = 'behandling-section-' + label.toLowerCase().replaceAll(/\s/g, '-');

  return (
    <StyledBehandlingSection data-testid={testid}>
      <Label htmlFor={id} size="small">
        {label}
      </Label>
      <div id={id}>{children}</div>
    </StyledBehandlingSection>
  );
};

const StyledBehandlingSection = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: break-spaces;
`;
