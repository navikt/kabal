import React from 'react';
import { StyledDescriptionTerm, StyledPreDescriptionDetails } from '@app/error-boundary/error-boundary';

interface DocumentErrorComponentProps {
  oppgaveId: string;
  documentId: string;
}

export const DocumentErrorComponent = ({ oppgaveId, documentId }: DocumentErrorComponentProps) => (
  <dl>
    <StyledDescriptionTerm>Behandlings-ID</StyledDescriptionTerm>
    <StyledPreDescriptionDetails>{oppgaveId}</StyledPreDescriptionDetails>
    <StyledDescriptionTerm>Dokument-ID</StyledDescriptionTerm>
    <StyledPreDescriptionDetails>{documentId}</StyledPreDescriptionDetails>
  </dl>
);
