import { Loader, Tooltip } from '@navikt/ds-react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError, skipToken } from '@reduxjs/toolkit/query';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { ErrorMessage, getErrorData } from '@app/functions/get-error-data';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { CheckmarkCircleFillIconColored, XMarkOctagonFillIconColored } from '../colored-icons/colored-icons';

export interface SavedStatusProps {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
}

export const SavedStatus = ({ isLoading, isSuccess, isError, error }: SavedStatusProps) => {
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);
  const { data } = useGetDocumentQuery(
    oppgaveId === skipToken || documentId === null ? skipToken : { oppgaveId, dokumentId: documentId },
  );

  const lastSaved =
    data === undefined ? null : <StatusText>{`Sist lagret: ${isoDateTimeToPretty(data.modified)}`}</StatusText>;

  if (isLoading) {
    return (
      <Container>
        <StatusText>Lagrer...</StatusText>

        <Tooltip content="Lagrer..." delay={0}>
          <Loader size="xsmall" />
        </Tooltip>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container>
        {lastSaved}

        <Tooltip content="Lagret!" delay={0}>
          <CheckmarkCircleFillIconColored />
        </Tooltip>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <StatusText>Feil ved lagring</StatusText>

        <Tooltip content={`Feil ved lagring:\n${formatErrorMessage(getErrorData(error))}`} delay={0}>
          <XMarkOctagonFillIconColored />
        </Tooltip>
      </Container>
    );
  }

  return null;
};

const formatErrorMessage = (error: ErrorMessage) => {
  const title = typeof error.status === 'undefined' ? error.title : `${error.title} (${error.status})`;
  const message = typeof error.detail === 'undefined' ? error.title : `${title}: ${error.detail}`;

  return message;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StatusText = styled.span`
  color: var(--a-text-subtle);
  font-size: var(--a-font-size-small);
`;
