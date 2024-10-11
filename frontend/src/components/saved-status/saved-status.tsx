import { isoDateTimeToPretty } from '@app/domain/date';
import { type ErrorMessage, getErrorData } from '@app/functions/get-error-data';
import { Loader, Tooltip } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { CheckmarkCircleFillIconColored, XMarkOctagonFillIconColored } from '../colored-icons/colored-icons';

export interface SavedStatusProps {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
  modified: string;
}

export const SavedStatus = ({ isLoading, isSuccess, isError, error, modified }: SavedStatusProps) => {
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
        <StatusText>Sist lagret: {isoDateTimeToPretty(modified)}</StatusText>

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
  gap: var(--a-spacing-1);
`;

const StatusText = styled.span`
  color: var(--a-text-subtle);
  font-size: var(--a-font-size-small);
`;
