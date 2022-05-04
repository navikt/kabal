import { Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useDeleteDocumentMutation } from '../../../redux-api/documents';

interface Props {
  children: ReactNode;
  oppgaveId: string;
  documentId: string;
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
    const { oppgaveId, documentId, children } = this.props;

    if (this.state.error !== null) {
      return <ErrorComponent error={this.state.error} oppgaveId={oppgaveId} documentId={documentId} />;
    }

    return children;
  }
}

interface ErrorComponentProps extends DeleteButtonProps {
  error: Error;
}

const ErrorComponent = ({ error, oppgaveId, documentId }: ErrorComponentProps) => (
  <ErrorContainer>
    <h1>Ooops, noe gikk galt :(</h1>
    <dl>
      <StyledDescriptionTerm>Behandlings-ID</StyledDescriptionTerm>
      <StyledPreDescriptionDetails>{oppgaveId}</StyledPreDescriptionDetails>
      <StyledDescriptionTerm>Dokument-ID</StyledDescriptionTerm>
      <StyledPreDescriptionDetails>{documentId}</StyledPreDescriptionDetails>
    </dl>
    <DeleteButton oppgaveId={oppgaveId} documentId={documentId} />
    <h2>Feilmelding</h2>
    <StyledErrorMessage>{error.message}</StyledErrorMessage>
  </ErrorContainer>
);

interface DeleteButtonProps {
  oppgaveId: string;
  documentId: string;
}

const DeleteButton = ({ oppgaveId, documentId }: DeleteButtonProps) => {
  const [deleteDocument] = useDeleteDocumentMutation();
  const canEdit = useCanEdit();

  const onClick = () =>
    deleteDocument({
      oppgaveId,
      dokumentId: documentId,
    });

  if (!canEdit) {
    return null;
  }

  return (
    <Button type="button" variant="danger" size="small" onClick={onClick}>
      <Delete />
      <span>Slett dokument</span>
    </Button>
  );
};

const ErrorContainer = styled.section`
  display: block;
  width: 210mm;
  padding: 16px;
  overflow-y: auto;
`;

const StyledDescriptionTerm = styled.dt`
  font-weight: bold;
  margin-top: 16px;
`;

const StyledPreDescriptionDetails = styled.dd`
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
