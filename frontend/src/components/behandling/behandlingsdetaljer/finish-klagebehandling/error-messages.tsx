import React from 'react';
import { ApiError } from '../../../../redux-api/error-type';
import { StyledAlertstripe } from '../../styled-components';

interface Props {
  error: ApiError | null;
}

export const ErrorMessage = ({ error }: Props) => {
  if (error === null) {
    return null;
  }

  return (
    <StyledAlertstripe type="advarsel">
      <ErrorList {...error} />
    </StyledAlertstripe>
  );
};

const ErrorList = ({ 'invalid-properties': invalidProperties }: ApiError) => (
  <ul>
    {invalidProperties.map(({ reason, field }) => (
      <li key={field}>{reason}</li>
    ))}
  </ul>
);
