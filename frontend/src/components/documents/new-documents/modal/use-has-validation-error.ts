import { useContext } from 'react';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
import type { DocumentValidationApiError, DocumentValidationFrontendError } from '@/types/documents/validation';

export const useHasValidationError = (
  dokumentId: string,
  error: DocumentValidationApiError | DocumentValidationFrontendError,
) => {
  const { validationErrors } = useContext(ModalContext);

  return validationErrors.some((e) => e.dokumentId === dokumentId && e.errors.includes(error));
};
