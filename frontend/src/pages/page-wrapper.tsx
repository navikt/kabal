import React from 'react';
import styled from 'styled-components';
import { Nav } from '../components/nav/nav';

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
}

export const OppgaverPageWrapper = ({ children }: OppgaverPageWrapperProps): JSX.Element => (
  <>
    <Nav />
    <main>
      <StyledArticle>{children}</StyledArticle>
    </main>
  </>
);

export const StyledArticle = styled.article`
  padding-left: 1em;
  padding-right: 1em;
`;
