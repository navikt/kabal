import React, { useState } from 'react';
import { IValidationErrors } from '../../functions/error-type-guard';

interface IValidationErrorContext {
  validationErrors: IValidationErrors;
  setValidationErrors: (errors: IValidationErrors) => void;
}

export const ValidationErrorContext = React.createContext<IValidationErrorContext | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const ValidationErrorProvider = ({ children }: Props) => {
  const [validationErrors, setValidationErrors] = useState<IValidationErrors>([]);

  return (
    <ValidationErrorContext.Provider value={{ validationErrors, setValidationErrors }}>
      {children}
    </ValidationErrorContext.Provider>
  );
};
