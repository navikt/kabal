import { getErrorData } from '@app/functions/get-error-data';
import { Detail, Label } from '@navikt/ds-react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from '../store';

export const apiErrorToast = (message: string, error: FetchBaseQueryError, args?: string | FetchArgs) => {
  const { title, detail, status } = getErrorData(error);

  toast.error(
    <>
      <Label size="small">{message}</Label>
      <Details label="Årsak">{title}</Details>
      {typeof args === 'undefined' ? null : <Details label="URL">{typeof args === 'string' ? args : args.url}</Details>}
      <Details label="Statuskode">{status}</Details>
      {title === detail ? null : <Details label="Detaljer">{detail}</Details>}
    </>,
  );
};

interface DetailProps {
  children?: string | number;
  label: string;
}

export const Details = ({ label, children }: DetailProps) => {
  if (typeof children === 'undefined') {
    return null;
  }

  return (
    <Detail>
      <span className="font-bold">{label}:</span> <code className="break-normal text-xs">{children}</code>
    </Detail>
  );
};
