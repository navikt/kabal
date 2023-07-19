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
`;

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export const OppgaverPageWrapper = ({ children, title }: OppgaverPageWrapperProps): JSX.Element => (
  <PageWrapper>
    {typeof title === 'undefined' ? null : (
      <Heading level="1" size="medium" spacing>
        {title}
      </Heading>
    )}
    <OppgaverContainer>{children}</OppgaverContainer>
  </PageWrapper>
);

const OppgaverContainer = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: 64px;
  overflow: auto;
  min-height: 100%;
  padding: 16px;
  padding-top: 0;
`;
