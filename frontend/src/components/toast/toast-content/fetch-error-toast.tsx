import { Detail, Label } from '@navikt/ds-react';
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import React from 'react';
import { styled } from 'styled-components';
import { isApiError } from '@app/types/errors';
import { toast } from '../store';

interface ErrorMessage {
  title: string;
  detail?: string;
  status?: number | string;
}

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

const getErrorData = (error: FetchBaseQueryError): ErrorMessage => {
  if (typeof error.status === 'number') {
    if (typeof error.data === 'string') {
      return { title: error.data, status: error.status };
    } else if (isApiError(error.data)) {
      return error.data;
    }
  }

  if (error.status === 'PARSING_ERROR') {
    return { title: error.error, status: error.status, detail: error.data };
  }

  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return { title: error.error, status: error.status };
  }

  if (error.status === 'CUSTOM_ERROR') {
    return { title: error.error, status: error.status, detail: getCustomErrorMessage(error.data) };
  }

  return { title: 'Ukjent feil' };
};

const getCustomErrorMessage = (data?: unknown): string | undefined => {
  if (typeof data === 'string') {
    return data;
  } else if (typeof data === 'number') {
    return data.toString();
  } else if (typeof data === 'object') {
    return JSON.stringify(data);
  }

  return undefined;
};
