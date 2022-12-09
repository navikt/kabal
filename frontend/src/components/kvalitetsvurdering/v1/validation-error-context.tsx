import React, { useState } from 'react';
import { IValidationSection } from '../../../functions/error-type-guard';

interface IValidationErrorContext {
  validationSectionErrors: IValidationSection[];
  setValidationSectionErrors: (errors: IValidationSection[]) => void;
}

export const ValidationErrorContext = React.createContext<IValidationErrorContext | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const ValidationErrorProvider = ({ children }: Props) => {
  const [validationErrors, setValidationErrors] = useState<IValidationSection[]>([]);

  return (
    <ValidationErrorContext.Provider
      value={{ validationSectionErrors: validationErrors, setValidationSectionErrors: setValidationErrors }}
    >
      {children}
    </ValidationErrorContext.Provider>
  );
};
