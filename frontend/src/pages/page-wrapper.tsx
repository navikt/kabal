import React from 'react';
import styled from 'styled-components';
import { Nav } from '../components/nav/nav';

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
}

export const OppgaverPageWrapper = ({ children }: OppgaverPageWrapperProps): JSX.Element => (
  <>
    <Nav />
    <StyledMain>
      <StyledArticle>{children}</StyledArticle>
    </StyledMain>
  </>
);

export const StyledArticle = styled.article`
  padding-left: 16px;
  padding-right: 16px;
`;

const StyledMain = styled.main`
  overflow: auto;
  flex: 1;
`;
