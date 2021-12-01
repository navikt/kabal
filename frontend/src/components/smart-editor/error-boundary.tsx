import { Fareknapp } from 'nav-frontend-knapper';
import React, { Component, ErrorInfo, ReactNode, useCallback, useEffect } from 'react';
import { useDeleteSmartEditorMutation } from '../../redux-api/smart-editor';
import { useDeleteSmartEditorIdMutation, useGetSmartEditorIdQuery } from '../../redux-api/smart-editor-id';

interface InnerErrorBoundaryProps {
  children: ReactNode;
  klagebehandlingId: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<InnerErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorMessage klagebehandlingId={this.props.klagebehandlingId} error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorMessageProps {
  klagebehandlingId: string;
  error?: unknown;
}

export const ErrorMessage = ({ klagebehandlingId, error }: ErrorMessageProps) => {
  const { data: smartEditorIdData } = useGetSmartEditorIdQuery(klagebehandlingId);
  const [deleteSmartEditor, { isLoading: isDeleting }] = useDeleteSmartEditorMutation();
  const [deleteSmartEditorReference, { isLoading: isDeletingRef }] = useDeleteSmartEditorIdMutation();

  const onClick = useCallback(() => {
    deleteSmartEditorReference(klagebehandlingId);

    if (typeof smartEditorIdData !== 'undefined' && smartEditorIdData.smartEditorId !== null) {
      deleteSmartEditor(smartEditorIdData.smartEditorId);
    }
  }, [klagebehandlingId, smartEditorIdData, deleteSmartEditor, deleteSmartEditorReference]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <h1>Kunne ikke vise smart-editoren</h1>
      <p>Mest sannsynlig er dataene feil pga. en oppdatering. Se konsollen for feilmelding.</p>
      <p>Ev. bare slett smart-editor-dataene og lag et nytt dokument.</p>
      <Fareknapp onClick={onClick} spinner={isDeleting || isDeletingRef} autoDisableVedSpinner>
        Slett smart-editor-dokument
      </Fareknapp>
    </div>
  );
};
