import { IMainDocument } from '@app/types/documents/documents';
import { DocumentValidationErrorType, NO_RECIPIENTS_ERROR } from '@app/types/documents/validation';
import { ApiError, isApiError } from '@app/types/errors';

export interface FinishProps {
  document: IMainDocument;
}

export interface ValidationError {
  dokumentId: string;
  title: string;
  errors: {
    type: DocumentValidationErrorType | typeof NO_RECIPIENTS_ERROR;
    message: string;
  }[];
}

const VALIDATION_ERRORS = Object.values(DocumentValidationErrorType);

const isSmartDocumentError = (error: unknown): error is DocumentValidationErrorType =>
  VALIDATION_ERRORS.some((e) => e === error);

const isSmartDocumentErrorObject = (error: unknown): error is { type: DocumentValidationErrorType } =>
  typeof error === 'object' && error !== null && 'type' in error && isSmartDocumentError(error.type);

interface DocumentError {
  type: DocumentValidationErrorType;
}

interface FinishValidationError extends ApiError {
  documents: {
    dokumentId: string;
    errors: DocumentError[];
  }[];
}

export const isSmartDocumentValidatonError = (error: unknown): error is { data: FinishValidationError } => {
  if (typeof error !== 'object' || error === null || !('data' in error) || !isApiError(error.data)) {
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
        d.errors.every(isSmartDocumentErrorObject),
    )
  );
};
