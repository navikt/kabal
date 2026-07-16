import type { IDocument } from '@/types/documents/documents';
import { DocumentValidationApiError, type DocumentValidationFrontendError } from '@/types/documents/validation';
import { isApiDataError, type KabalApiErrorData } from '@/types/errors';

export interface FinishProps extends React.RefAttributes<HTMLDivElement> {
  document: IDocument;
  accessError?: string | null;
  validationErrors?: ValidationError['errors'];
}

export interface ValidationError {
  dokumentId: string;
  title: string;
  errors: (DocumentValidationApiError | DocumentValidationFrontendError)[];
}

const VALIDATION_ERRORS = Object.values(DocumentValidationApiError);

const isSmartDocumentError = (error: unknown): error is DocumentValidationApiError =>
  VALIDATION_ERRORS.some((e) => e === error);

interface FinishValidationError extends KabalApiErrorData {
  documents: {
    dokumentId: string;
    errors: DocumentValidationApiError[];
  }[];
}

export const isSmartDocumentValidatonError = (error: unknown): error is { data: FinishValidationError } => {
  if (!isApiDataError(error)) {
    return false;
  }

  return (
    'documents' in error.data &&
    Array.isArray(error.data.documents) &&
    error.data.documents.every(
      (d) =>
        'dokumentId' in d &&
        typeof d.dokumentId === 'string' &&
        'errors' in d &&
        Array.isArray(d.errors) &&
        d.errors.every(isSmartDocumentError),
    )
  );
};
