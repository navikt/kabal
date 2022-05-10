import { Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props extends DeleteButtonProps {
  children: ReactNode;
  errorComponent: (error: Error) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.error !== null) {
      const { errorComponent, onDelete, deleteButtonText, isDeleting, deleteButtonDisabled } = this.props;

      return (
        <ErrorContainer>
          <h1>Ooops, noe gikk galt :(</h1>
          {errorComponent(this.state.error)}
          <DeleteButton
            onDelete={onDelete}
            deleteButtonText={deleteButtonText}
            isDeleting={isDeleting}
            deleteButtonDisabled={deleteButtonDisabled}
          />
          <h2>Feilmelding</h2>
          <StyledErrorMessage>{this.state.error.message}</StyledErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

interface DeleteButtonProps {
  onDelete?: () => void;
  isDeleting?: boolean;
  deleteButtonDisabled?: boolean;
  deleteButtonText?: string;
}

export const DeleteButton = ({
  onDelete,
  isDeleting = false,
  deleteButtonText = 'Slett',
  deleteButtonDisabled = false,
}: DeleteButtonProps) => {
  if (typeof onDelete === 'undefined') {
    return null;
  }

  const onClick = () => onDelete();

  return (
    <Button
      type="button"
      variant="danger"
      size="small"
      onClick={onClick}
      disabled={deleteButtonDisabled}
      loading={isDeleting}
    >
      <Delete />
      <span>{deleteButtonText}</span>
    </Button>
  );
};

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
