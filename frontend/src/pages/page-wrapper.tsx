import React from 'react';
import styled from 'styled-components';
import { Nav } from '../components/nav/nav';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => (
  <>
    <Nav />
    <StyledMain>{children}</StyledMain>
  </>
);

const StyledMain = styled.main`
  overflow: auto;
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

export const OppgaverPageWrapper = ({ children }: Props): JSX.Element => (
  <PageWrapper>
    <StyledArticle>{children}</StyledArticle>
  </PageWrapper>
);

export const StyledArticle = styled.article`
  overflow: auto;
  min-height: 100%;
`;
