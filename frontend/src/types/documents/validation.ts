import { Path } from 'slate';

export enum DocumentValidationErrorType {
  EMPTY_PLACEHOLDER = 'EMPTY_PLACEHOLDER',
  EMPTY_REGELVERK = 'EMPTY_REGELVERK',
  WRONG_DATE = 'WRONG_DATE',
  DOCUMENT_MODIFIED = 'DOCUMENT_MODIFIED',
  INVALID_RECIPIENT = 'INVALID_RECIPIENT',
}

// Caught by frontend
export const NO_RECIPIENTS_ERROR = 'NO_RECIPIENTS_ERROR';

interface IValidationError {
  type: DocumentValidationErrorType;
  paths: Path[];
}
interface IDocumentValidationError {
  dokumentId: string;
  errors: IValidationError[];
}

export type IValidateDocumentResponse = IDocumentValidationError[];
