import { isoDateTimeToPretty } from '@app/domain/date';
import { type ErrorMessage, getErrorData } from '@app/functions/get-error-data';
import { HStack, Loader, Tooltip } from '@navikt/ds-react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ReactNode } from 'react';
import { CheckmarkCircleFillIconColored, XMarkOctagonFillIconColored } from '../colored-icons/colored-icons';

export interface SavedStatusProps {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
  modified?: string;
  fallback?: ReactNode;
}

const CLASSNAMES = 'text-text-subtle text-small';

export const SavedStatus = ({ isLoading, isSuccess, isError, error, modified, fallback }: SavedStatusProps) => {
  const lastSaved =
    typeof modified === 'string' ? (
      <>
        Sist lagret: <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>
      </>
    ) : null;

  if (isLoading) {
    return (
      <HStack align="center" gap="1" className={CLASSNAMES}>
        {lastSaved}

        <Tooltip content="Lagrer..." delay={0}>
          <HStack align="center" gap="1">
            <Loader size="xsmall" /> Lagrer...
          </HStack>
        </Tooltip>
      </HStack>
    );
  }

  if (isSuccess) {
    return (
      <HStack align="center" gap="1" className={CLASSNAMES}>
        {lastSaved}

        <Tooltip content="Lagret!" delay={0}>
          <CheckmarkCircleFillIconColored aria-hidden className="mb-1" />
        </Tooltip>
      </HStack>
    );
  }

  if (isError) {
    return (
      <HStack align="center" gap="1" className={CLASSNAMES}>
        Feil ved lagring
        <Tooltip content={`Feil ved lagring:\n${formatErrorMessage(getErrorData(error))}`} delay={0}>
          <XMarkOctagonFillIconColored />
        </Tooltip>
      </HStack>
    );
  }

  return fallback ?? null;
};

const formatErrorMessage = (error: ErrorMessage) => {
  const title = typeof error.status === 'undefined' ? error.title : `${error.title} (${error.status})`;
  const message = typeof error.detail === 'undefined' ? error.title : `${title}: ${error.detail}`;

  return message;
};
