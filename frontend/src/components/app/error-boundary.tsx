import { Button, CopyButton, Heading } from '@navikt/ds-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { styled } from 'styled-components';
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
      return (
        <ErrorContainer className={className}>
          <Heading level="1" size="large" spacing>
            Ooops, noe gikk galt :(
          </Heading>
          <Heading level="2" size="medium" spacing>
            Feilmelding
          </Heading>
          <ErrorContent>
            <Code>{this.state.error.message}</Code>
            <Code>{this.state.error.stack}</Code>
            <Row>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Last Kabal på nytt
              </Button>
              <CopyButton
                copyText={`${this.state.error.message}\n${this.state.error.stack}`}
                text="Kopier feilmeldingen"
                variant="action"
              />
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
  background: var(--a-bg-default);
  padding: 16px;
  overflow-y: auto;
  box-shadow: var(--a-shadow-medium);
  margin-top: 32px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: left;
  row-gap: 8px;
`;

const Code = styled.code`
  display: block;
  padding: 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: var(--a-border-radius-medium);
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: break-word;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
`;
