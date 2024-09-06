import { Button, ButtonProps } from '@navikt/ds-react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { styled } from 'styled-components';
import { pushError } from '@app/observability';

interface Props {
  children: ReactNode;
  className?: string;
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
    pushError(error);
  }

  render() {
    const { children, errorComponent, actionButton, className } = this.props;

    if (this.state.error !== null) {
      return (
        <ErrorContainer className={className}>
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
  width: 100%;
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-4);
  overflow-y: auto;
  box-shadow: var(--a-shadow-medium);
`;

export const StyledDescriptionTerm = styled.dt`
  font-weight: bold;
  margin-top: var(--a-spacing-4);
`;

export const StyledPreDescriptionDetails = styled.dd`
  display: block;
  padding: var(--a-spacing-2);
  background-color: var(--a-surface-subtle);
  border: 1px solid var(--a-border-divider);
  border-radius: var(--a-border-radius-medium);
  margin-left: 0;
  margin-top: var(--a-spacing-1);
  white-space: pre-wrap;
  word-break: break-all;
`;

const StyledErrorMessage = styled.code`
  display: block;
  padding: var(--a-spacing-4);
  background-color: var(--a-surface-subtle);
  border: 1px solid var(--a-border-divider);
  border-radius: var(--a-border-radius-medium);
  margin-bottom: var(--a-spacing-4);
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: break-word;
`;
