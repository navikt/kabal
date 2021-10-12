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

  return <StyledAlertstripe type="advarsel">{error.detail}</StyledAlertstripe>;
};
