import { Detail, Label } from '@navikt/ds-react';
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import React from 'react';
import { styled } from 'styled-components';
import { getErrorData } from '@app/functions/get-error-data';
import { toast } from '../store';

export const apiErrorToast = (message: string, error: FetchBaseQueryError, args?: string | FetchArgs) => {
  const { title, detail, status } = getErrorData(error);

  toast.error(
    <>
      <Label size="small">{message}</Label>
      <Details label="Uventet feil">{title}</Details>
      {typeof args === 'undefined' ? null : <Details label="URL">{typeof args === 'string' ? args : args.url}</Details>}
      <Details label="Statuskode">{status}</Details>
      <Details label="Detaljer">{detail}</Details>
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
  font-size: 12px;
`;
