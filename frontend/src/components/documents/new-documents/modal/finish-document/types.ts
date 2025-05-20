import type { IDocument } from '@app/types/documents/documents';
import { DocumentValidationErrorType, type NO_RECEIVERS_ERROR } from '@app/types/documents/validation';
import { type ApiError, isApiDataError } from '@app/types/errors';

export interface FinishProps {
  document: IDocument;
}

export interface ValidationError {
  dokumentId: string;
  title: string;
  errors: {
    type: DocumentValidationErrorType | typeof NO_RECEIVERS_ERROR;
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
        d.errors.every(isSmartDocumentErrorObject),
    )
  );
};
