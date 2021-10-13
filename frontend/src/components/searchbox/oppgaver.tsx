import React from 'react';
import styled from 'styled-components';

interface Props {
  open: boolean;
  children: JSX.Element | JSX.Element[];
}

export const Oppgaver = ({ open, children }: Props) => {
  if (!open) {
    return null;
  }

  return <StyledContainer>{children}</StyledContainer>;
};

const StyledContainer = styled.section`
  grid-area: oppgaver;
  border-top: 1px solid #c6c2bf;
  max-width: 900px;
`;
