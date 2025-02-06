import { VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  white-space: normal;
  width: 750px;
  grid-column-gap: 1px;
  flex-grow: 1;
`;

export const StyledBehandlingSection = styled.section`
  padding: var(--a-spacing-4);
  min-height: 100%;
`;

interface DateContainerProps {
  children: React.ReactNode;
}

export const DateContainer = ({ children }: DateContainerProps) => <VStack marginBlock="0 4">{children}</VStack>;
