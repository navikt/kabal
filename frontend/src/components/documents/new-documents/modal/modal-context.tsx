import { createContext, useCallback, useState } from 'react';
import type { ValidationError } from '@/components/documents/new-documents/modal/finish-document/types';

interface IModalContext {
  close: () => void;
  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
}

const noop = () => undefined;

export const ModalContext = createContext<IModalContext>({
  close: noop,
  validationErrors: [],
  setValidationErrors: noop,
});

interface Props {
  children: React.ReactNode;
}

export const ModalContextElement = ({ children }: Props) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(INITIAL_VALIDATION_ERRORS);

  const close = useCallback(() => setValidationErrors(INITIAL_VALIDATION_ERRORS), []);

  return (
    <ModalContext.Provider
      value={{
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
