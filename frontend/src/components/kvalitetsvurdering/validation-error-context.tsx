import type { IValidationSection } from '@app/functions/error-type-guard';
import { createContext, useState } from 'react';

interface IValidationErrorContext {
  validationSectionErrors: IValidationSection[];
  setValidationSectionErrors: (errors: IValidationSection[]) => void;
}

export const ValidationErrorContext = createContext<IValidationErrorContext>({
  validationSectionErrors: [],
  setValidationSectionErrors: () => undefined,
});

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
