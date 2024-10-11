import { getErrorData } from '@app/functions/get-error-data';
import { Detail, Label } from '@navikt/ds-react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { styled } from 'styled-components';
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

const Details = ({ label, children }: DetailProps) => {
  if (typeof children === 'undefined') {
    return null;
  }

  return (
    <Detail>
      <DetailLabel>{label}:</DetailLabel> <StyledCode>{children}</StyledCode>
    </Detail>
  );
};

const DetailLabel = styled.span`
  font-weight: bold;
`;

const StyledCode = styled.code`
  font-size: var(--a-spacing-3);
  word-break: break-word;
`;
