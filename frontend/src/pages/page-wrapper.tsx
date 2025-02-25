import { Heading, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => <StyledMain>{children}</StyledMain>;

const StyledMain = styled.main`
  overflow: auto;
  flex-grow: 1;
  padding: var(--a-spacing-4);
  width: 100%;
`;

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
  title?: string;
  testId?: string;
}

export const OppgaverPageWrapper = ({ children, title, testId }: OppgaverPageWrapperProps): React.JSX.Element => (
  <VStack flexGrow="1" width="100%" overflow="hidden" data-testid={`${testId}-container`}>
    {typeof title === 'undefined' ? null : (
      <StyledOppgaveHeading level="1" size="medium" data-testid={`${testId}-title`}>
        {title}
      </StyledOppgaveHeading>
    )}
    <OppgaverContainer data-testid={testId}>{children}</OppgaverContainer>
  </VStack>
);

const StyledOppgaveHeading = styled(Heading)`
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  padding-top: var(--a-spacing-4);
`;

const OppgaverContainer = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-16);
  overflow: auto;
  width: 100%;
  flex-grow: 1;
  padding: var(--a-spacing-4);

  > * {
    min-width: 100%;
    width: fit-content;
  }
`;
