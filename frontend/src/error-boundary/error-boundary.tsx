import { pushError } from '@app/observability';
import { BoxNew, Button, type ButtonProps } from '@navikt/ds-react';
import { Component, type ErrorInfo, type FragmentProps, type ReactNode } from 'react';

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
        <BoxNew className={className} background="default" width="100%" padding="4" overflowY="auto" shadow="dialog">
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
          <BoxNew
            as="code"
            padding="4"
            borderRadius="medium"
            marginBlock="0 4"
            className="whitespace-pre-wrap break-words"
          >
            {this.state.error.message}
          </BoxNew>
        </BoxNew>
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

export const StyledDescriptionTerm = ({ children }: FragmentProps) => (
  <BoxNew as="dt" marginBlock="4 0" className="font-bold">
    {children}
  </BoxNew>
);

export const StyledPreDescriptionDetails = ({ children }: FragmentProps) => (
  <BoxNew
    as="dd"
    marginBlock="1 0"
    padding="4"
    borderRadius="medium"
    background="neutral-moderate"
    borderColor="neutral"
    borderWidth="1"
    className="whitespace-pre-wrap break-all text-ax-text-neutral"
  >
    {children}
  </BoxNew>
);
