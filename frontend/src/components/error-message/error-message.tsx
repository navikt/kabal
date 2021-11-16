import React from 'react';

interface ErrorMessageProps {
  error?: string;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (typeof error === 'undefined') {
    return null;
  }

  return (
    <div className="skjemaelement__feilmelding">
      <p className="typo-feilmelding">{error}</p>
    </div>
  );
};
