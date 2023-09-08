import { Heading } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => <StyledMain>{children}</StyledMain>;

const StyledMain = styled.main`
  overflow: auto;
  flex-grow: 1;
  padding: 16px;
  width: 100%;
`;

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export const OppgaverPageWrapper = ({ children, title }: OppgaverPageWrapperProps): JSX.Element => (
  <StyledOppgaverPageWrapper>
    {typeof title === 'undefined' ? null : (
      <Heading level="1" size="medium" spacing>
        {title}
      </Heading>
    )}
    <OppgaverContainer>{children}</OppgaverContainer>
  </StyledOppgaverPageWrapper>
);

const StyledOppgaverPageWrapper = styled.main`
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  padding: 16px;
`;

const OppgaverContainer = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: 64px;
  overflow: auto;
  width: 100%;
  height: 100%;
  padding-top: 0;

  > * {
    min-width: calc(100vw - 32px);
  }
`;
