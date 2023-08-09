import { Loader, Tooltip } from '@navikt/ds-react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { ErrorMessage, getErrorData } from '@app/functions/get-error-data';
import { CheckmarkCircleFillIconColored, XMarkOctagonFillIconColored } from '../colored-icons/colored-icons';

export interface SavedStatusProps {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
}

export const SavedStatus = ({ isLoading, isSuccess, isError, error }: SavedStatusProps) => {
  if (isLoading) {
    return (
      <Tooltip content="Lagrer..." delay={0}>
        <Loader size="xsmall" />
      </Tooltip>
    );
  }

  if (isSuccess) {
    return (
      <Tooltip content="Lagret!" delay={0}>
        <CheckmarkCircleFillIconColored />
      </Tooltip>
    );
  }

  if (isError) {
    return (
      <Tooltip content={`Feil ved lagring:\n${formatErrorMessage(getErrorData(error))}`} delay={0}>
        <XMarkOctagonFillIconColored />
      </Tooltip>
    );
  }

  return null;
};

const formatErrorMessage = (error: ErrorMessage) => {
  const title = typeof error.status === 'undefined' ? error.title : `${error.title} (${error.status})`;
  const message = typeof error.detail === 'undefined' ? error.title : `${title}: ${error.detail}`;

  return message;
};
