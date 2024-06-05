import { ErrorMessage } from '@navikt/ds-react';

interface ErrorMessageProps {
  error?: string;
}

export const InputError = ({ error }: ErrorMessageProps) => {
  if (typeof error === 'undefined') {
    return null;
  }

  return <ErrorMessage size="small">{error}</ErrorMessage>;
};
