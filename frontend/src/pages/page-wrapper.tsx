import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => <StyledMain>{children}</StyledMain>;

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
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  overflow: auto;
  min-height: 100%;
  padding-bottom: 32px;
`;
