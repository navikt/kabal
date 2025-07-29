import { VERSION_CHECKER } from '@app/components/version-checker/version-checker';
import { ENVIRONMENT } from '@app/environment';
import { pushError } from '@app/observability';
import { Alert, BoxNew, Button, CopyButton, Heading, HStack, VStack } from '@navikt/ds-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

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
        <BoxNew
          as="section"
          background="default"
          padding="4"
          width="fit-content"
          overflowY="auto"
          shadow="dialog"
          marginBlock="8"
          marginInline="auto"
          className={className}
        >
          <Heading level="1" size="large" spacing>
            Ooops, noe gikk galt :(
          </Heading>
          {isUpToDate ? null : (
            <Alert variant="warning" className="mb-4">
              <b>Kabal er utdatert.</b>
              <div>
                Din versjon: <Code>{ENVIRONMENT.version}</Code>
              </div>
              <div>
                Siste versjon: <Code>{lastestVersion}</Code>
              </div>
            </Alert>
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
        </BoxNew>
      );
    }

    return children;
  }
}

interface CodeProps {
  children: string;
}

const Code = ({ children }: CodeProps) => (
  <BoxNew
    as="code"
    background="neutral-soft"
    borderWidth="1"
    borderColor="neutral"
    borderRadius="medium"
    paddingInline="1"
  >
    {children}
  </BoxNew>
);

interface CodeBlockProps {
  children?: string;
}

const CodeBlock = ({ children }: CodeBlockProps) => (
  <BoxNew
    as="code"
    background="neutral-soft"
    borderWidth="1"
    borderColor="neutral"
    borderRadius="medium"
    padding="4"
    className="wrap-break-word block whitespace-pre-wrap"
  >
    {children}
  </BoxNew>
);
