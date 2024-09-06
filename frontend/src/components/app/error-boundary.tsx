import { Alert, Button, CopyButton, Heading } from '@navikt/ds-react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { styled } from 'styled-components';
import { VERSION_CHECKER } from '@app/components/version-checker/version-checker';
import { ENVIRONMENT } from '@app/environment';
import { pushError } from '@app/observability';

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
        <ErrorContainer className={className}>
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
          <ErrorContent>
            <CodeBlock>{this.state.error.message}</CodeBlock>
            <CodeBlock>{this.state.error.stack}</CodeBlock>
            <Row>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Last Kabal på nytt
              </Button>
              <CopyButton copyText={copyText} text="Kopier feilmeldingen" variant="action" />
            </Row>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return children;
  }
}

const ErrorContainer = styled.section`
  display: block;
  width: fit-content;
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-4);
  overflow-y: auto;
  box-shadow: var(--a-shadow-medium);
  margin-top: var(--a-spacing-8);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--a-spacing-8);
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: left;
  row-gap: var(--a-spacing-2);
`;

const Code = styled.code`
  background-color: var(--a-bg-subtle);
  border: 1px solid var(--a-border-divider);
  border-radius: var(--a-border-radius-medium);
  padding-left: var(--a-spacing-1);
  padding-right: var(--a-spacing-1);
`;

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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
`;

const StyledAlert = styled(Alert)`
  margin-bottom: var(--a-spacing-4);
`;
