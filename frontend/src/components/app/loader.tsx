import { Loader } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface Props {
  text: string;
}

export const AppLoader = ({ text }: Props) => (
  <LoaderWrapper>
    <Loader size="2xlarge" variant="interaction" transparent title={text} />
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
