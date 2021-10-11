import React from 'react';
import styled from 'styled-components';

export const Oppgaver = () => {
  const title = 'Oppgaver';
  return <StyledContainer>{title}</StyledContainer>;
};

const StyledContainer = styled.section`
  grid-area: oppgaver;
  border-top: 1px solid #c6c2bf;
`;
