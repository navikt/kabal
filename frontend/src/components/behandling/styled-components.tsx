import { Box, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  white-space: normal;
  width: 750px;
  grid-column-gap: 1px;
  flex-grow: 1;
`;

interface BehandlingSectionProps {
  children: React.ReactNode;
}

export const StyledBehandlingSection = ({ children }: BehandlingSectionProps) => (
  <Box padding="4" minHeight="100%">
    {children}
  </Box>
);

interface DateContainerProps {
  children: React.ReactNode;
}

export const DateContainer = ({ children }: DateContainerProps) => <VStack marginBlock="0 4">{children}</VStack>;
