import React from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../domain/date';

interface Props {
  age?: number;
  frist: string;
}

export const Deadline = ({ frist, age }: Props) => (
  <StyledDeadline age={age} dateTime={frist}>
    {isoDateToPretty(frist)}
  </StyledDeadline>
);

interface StyledDeadlineProps {
  age?: number;
}

const StyledDeadline = styled.time<StyledDeadlineProps>`
  color: ${({ age }) => (typeof age === 'number' && age >= 120 ? '#C30000' : '#54483F')};
`;
