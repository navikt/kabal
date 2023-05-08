import React from 'react';
import styled from 'styled-components';
import { Filters } from './filters';
import { Signature } from './signature';

export const Settings = () => (
  <StyledSettings>
    <Filters />
    <Signature />
  </StyledSettings>
);

const StyledSettings = styled.article`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  gap: 16px;
`;
