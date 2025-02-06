import { VERSION_CHECKER } from '@app/components/version-checker/version-checker';
import { ENVIRONMENT } from '@app/environment';
import { pushError } from '@app/observability';
import { Alert, Box, Button, CopyButton, HStack, Heading, VStack } from '@navikt/ds-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { styled } from 'styled-components';

interface Props {
  children: ReactNode;
  className?: string;
}

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    pushError(error);
  }

  render() {
    const { children, className } = this.props;

    if (this.state.error !== null) {
      const lastestVersion = VERSION_CHECKER.getLatestVersion();
      const isUpToDate = VERSION_CHECKER.getIsUpToDate();

      const versionText = isUpToDate
        ? `Kabal er utdatert: ${ENVIRONMENT.version} vs. ${lastestVersion}`
        : `Kabal er oppdatert: ${ENVIRONMENT.version} vs. ${lastestVersion}`;

      const copyText = `${versionText}\n\n${this.state.error.message}\n\n${this.state.error.stack}`;

      return (
        <Box
          as="section"
          background="bg-default"
          padding="4"
          width="fit-content"
          overflowY="auto"
          shadow="medium"
          marginBlock="8"
          marginInline="auto"
          className={className}
        >
          <Heading level="1" size="large" spacing>
            Ooops, noe gikk galt :(
          </Heading>
          {isUpToDate ? null : (
            <StyledAlert variant="warning">
              <b>Kabal er utdatert.</b>
              <div>
                Din versjon: <Code>{ENVIRONMENT.version}</Code>
              </div>
              <div>
                Siste versjon: <Code>{lastestVersion}</Code>
              </div>
            </StyledAlert>
          )}
          <Heading level="2" size="medium" spacing>
            Feilmelding
          </Heading>
          <VStack align="start" justify="start" gap="2">
            <CodeBlock>{this.state.error.message}</CodeBlock>
            <CodeBlock>{this.state.error.stack}</CodeBlock>
            <HStack gap="2">
              <Button onClick={() => window.location.reload()} variant="secondary">
                Last Kabal på nytt
              </Button>
              <CopyButton copyText={copyText} text="Kopier feilmeldingen" variant="action" />
            </HStack>
          </VStack>
        </Box>
      );
    }

    return children;
  }
}

interface CodeProps {
  children: string;
}

const Code = ({ children }: CodeProps) => (
  <Box
    as="code"
    background="bg-subtle"
    borderWidth="1"
    borderColor="border-divider"
    borderRadius="medium"
    paddingInline="1"
  >
    {children}
  </Box>
);

const CodeBlock = styled.code`
  display: block;
  padding: var(--a-spacing-4);
  background-color: var(--a-bg-subtle);
  border: 1px solid var(--a-border-divider);
  border-radius: var(--a-border-radius-medium);
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: break-word;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: var(--a-spacing-4);
`;
