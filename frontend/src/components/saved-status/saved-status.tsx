import { isoDateTimeToPretty } from '@app/domain/date';
import { type ErrorMessage, getErrorData } from '@app/functions/get-error-data';
import { HStack, Loader, Tooltip } from '@navikt/ds-react';
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
      <HStack align="center" gap="1">
        <StatusText>Lagrer...</StatusText>

        <Tooltip content="Lagrer..." delay={0}>
          <Loader size="xsmall" />
        </Tooltip>
      </HStack>
    );
  }

  if (isSuccess) {
    return (
      <HStack align="center" gap="1">
        <StatusText>Sist lagret: {isoDateTimeToPretty(modified)}</StatusText>

        <Tooltip content="Lagret!" delay={0}>
          <CheckmarkCircleFillIconColored />
        </Tooltip>
      </HStack>
    );
  }

  if (isError) {
    return (
      <HStack align="center" gap="1">
        <StatusText>Feil ved lagring</StatusText>

        <Tooltip content={`Feil ved lagring:\n${formatErrorMessage(getErrorData(error))}`} delay={0}>
          <XMarkOctagonFillIconColored />
        </Tooltip>
      </HStack>
    );
  }

  return null;
};

const formatErrorMessage = (error: ErrorMessage) => {
  const title = typeof error.status === 'undefined' ? error.title : `${error.title} (${error.status})`;
  const message = typeof error.detail === 'undefined' ? error.title : `${title}: ${error.detail}`;

  return message;
};

const StatusText = styled.span`
  color: var(--a-text-subtle);
  font-size: var(--a-font-size-small);
`;
