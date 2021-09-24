import React from 'react';
import styled from 'styled-components';
import { Nav } from '../components/nav/nav';

export const OppgaverPageWrapper: React.FC = ({ children }) => (
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
