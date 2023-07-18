import React from 'react';
import { styled } from 'styled-components';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => <StyledMain>{children}</StyledMain>;

const StyledMain = styled.main`
  overflow: auto;
  flex-grow: 1;
  padding: 16px;
`;

export const OppgaverPageWrapper = ({ children }: Props): JSX.Element => (
  <PageWrapper>
    <OppgaverContainer>{children}</OppgaverContainer>
  </PageWrapper>
);

const OppgaverContainer = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: 75px;
  overflow: auto;
  min-height: 100%;
  padding: 16px;
`;
