import { Loader } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface LoadingProps {
  loading: boolean;
}

export const Loading = ({ loading }: LoadingProps) => {
  if (!loading) {
    return null;
  }

  return (
    <SpinnerBackground>
      <Loader size="xlarge" />
    </SpinnerBackground>
  );
};

const SpinnerBackground = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  justify-content: center;
  padding: 1em;
  align-items: center;
`;
