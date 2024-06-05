import { StyledDescriptionTerm, StyledPreDescriptionDetails } from '@app/error-boundary/error-boundary';

export const ErrorComponent = ({ textId }: { textId: string }) => (
  <dl>
    <StyledDescriptionTerm>Tekst-ID</StyledDescriptionTerm>
    <StyledPreDescriptionDetails>{textId}</StyledPreDescriptionDetails>
  </dl>
);
