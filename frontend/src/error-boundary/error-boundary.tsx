import { Button, ButtonProps } from '@navikt/ds-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  errorComponent: (error: Error) => ReactNode;
  actionButton?: ActionButtonProps;
}

interface State {
  error: Error | null;
  loading: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, loading: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { children, errorComponent, actionButton } = this.props;

    if (this.state.error !== null) {
      return (
        <ErrorContainer>
          <h1>Ooops, noe gikk galt :(</h1>
          {errorComponent(this.state.error)}
          {typeof actionButton === 'undefined' ? null : (
            <ActionButton
              {...actionButton}
              loading={Boolean(actionButton.loading) || this.state.loading}
              onClick={async (event) => {
                this.setState({ loading: true });
                await actionButton.onClick(event);
                this.setState({ error: null, loading: false });
              }}
            />
          )}
          <h2>Feilmelding</h2>
          <StyledErrorMessage>{this.state.error.message}</StyledErrorMessage>
        </ErrorContainer>
      );
    }

    return children;
  }
}

interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  buttonText: string;
  buttonIcon: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<unknown>;
}

const ActionButton = ({ buttonText, buttonIcon, ...rest }: ActionButtonProps) => (
  <Button {...rest} icon={buttonIcon}>
    <span>{buttonText}</span>
  </Button>
);

const ErrorContainer = styled.section`
  display: block;
  width: 210mm;
  padding: 16px;
  overflow-y: auto;
`;

export const StyledDescriptionTerm = styled.dt`
  font-weight: bold;
  margin-top: 16px;
`;

export const StyledPreDescriptionDetails = styled.dd`
  display: block;
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 0;
  margin-top: 4px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const StyledErrorMessage = styled.code`
  display: block;
  padding: 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: break-word;
`;
