import React from 'react';
import styled from 'styled-components';

interface Props {
  age: number;
}

export const Age = ({ age }: Props) => (
  <StyledAge age={age}>
    {age} {age === 1 ? 'dag' : 'dager'}
  </StyledAge>
);

interface StyledAgeProps {
  age: number;
}

const StyledAge = styled.span<StyledAgeProps>`
  color: ${({ age }) => (age >= 120 ? '#C30000' : '#54483F')};
`;
