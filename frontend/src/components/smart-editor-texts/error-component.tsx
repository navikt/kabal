import React from 'react';
import { StyledDescriptionTerm, StyledPreDescriptionDetails } from '../../error-boundary/error-boundary';

export const ErrorComponent = ({ textId }: { textId: string }) => (
  <dl>
    <StyledDescriptionTerm>Tekst-ID</StyledDescriptionTerm>
    <StyledPreDescriptionDetails>{textId}</StyledPreDescriptionDetails>
  </dl>
);
