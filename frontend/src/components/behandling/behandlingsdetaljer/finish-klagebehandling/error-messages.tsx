import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import styled from 'styled-components';
import { IValidationErrors } from '../../../../functions/error-type-guard';

interface Props {
  errors: IValidationErrors;
}

export const ValidationSummary = ({ errors }: Props) => {
  if (errors.length === 0) {
    return null;
  }

  const errorMessages = errors.map(({ reason, field }) => <li key={field}>{reason}</li>);

  return (
    <StyledAlertStripe type="advarsel">
      <div>Kan ikke fullføre behandling. Dette mangler:</div>
      <AlertStripeListElement>{errorMessages}</AlertStripeListElement>
    </StyledAlertStripe>
  );
};

const StyledAlertStripe = styled(Alertstripe)`
  margin-bottom: 1em;
`;

const AlertStripeListElement = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 1em;
`;
