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

const StyledSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
`;
