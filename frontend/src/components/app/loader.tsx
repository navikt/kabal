import { Loader } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

export const RouterLoader = () => (
  <LoaderWrapper>
    <Loader size="2xlarge" variant="interaction" transparent title="Laster siden..." />
  </LoaderWrapper>
);

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #fafafa;
`;
