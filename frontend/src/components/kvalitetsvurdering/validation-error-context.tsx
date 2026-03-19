import { createContext, useState } from 'react';
import type { IValidationSection } from '@/functions/error-type-guard';

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
