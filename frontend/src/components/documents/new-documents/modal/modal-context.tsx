import type { ValidationError } from '@app/components/documents/new-documents/modal/finish-document/types';
import type { IMainDocument } from '@app/types/documents/documents';
import { createContext, useCallback, useState } from 'react';

interface IModalContext {
  document: IMainDocument | null;
  setDocument: (document: IMainDocument | null) => void;
  close: () => void;

  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
}

const noop = () => {};

export const ModalContext = createContext<IModalContext>({
  document: null,
  setDocument: noop,
  close: noop,
  validationErrors: [],
  setValidationErrors: noop,
});

interface Props {
  children: React.ReactNode;
}

export const ModalContextElement = ({ children }: Props) => {
  const [document, setInternalDocument] = useState<IMainDocument | null>(null);

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(INITIAL_VALIDATION_ERRORS);

  const setDocument = useCallback((newDocument: IMainDocument | null) => {
    setInternalDocument(newDocument);
    // Reset state when document changes or modal is closed.
    setValidationErrors(INITIAL_VALIDATION_ERRORS);
  }, []);

  const close = useCallback(() => {
    setValidationErrors(INITIAL_VALIDATION_ERRORS);
    setDocument(null);
  }, [setDocument]);

  return (
    <ModalContext.Provider
      value={{
        document,
        setDocument,
        close,
        validationErrors,
        setValidationErrors,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const INITIAL_VALIDATION_ERRORS: ValidationError[] = [];
