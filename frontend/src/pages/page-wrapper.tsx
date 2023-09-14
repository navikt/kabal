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
  testId?: string;
}

export const OppgaverPageWrapper = ({ children, title, testId }: OppgaverPageWrapperProps): JSX.Element => (
  <StyledOppgaverPageWrapper data-testid={`${testId}-container`}>
    {typeof title === 'undefined' ? null : (
      <StyledOppgaveHeading level="1" size="medium" data-testid={`${testId}-title`}>
        {title}
      </StyledOppgaveHeading>
    )}
    <OppgaverContainer data-testid={testId}>{children}</OppgaverContainer>
  </StyledOppgaverPageWrapper>
);

export const SearchPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
`;

const StyledOppgaverPageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  padding: 0;
`;

const StyledOppgaveHeading = styled(Heading)`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
`;

const OppgaverContainer = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: 64px;
  overflow: auto;
  width: 100%;
  flex-grow: 1;
  padding: 16px;

  > * {
    min-width: 100%;
    width: fit-content;
  }
`;
