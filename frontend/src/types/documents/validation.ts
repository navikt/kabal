import { Path } from 'slate';

export enum DocumentValidationErrorType {
  EMPTY_PLACEHOLDERS = 'EMPTY_PLACEHOLDERS',
  EMPTY_REGELVERK = 'EMPTY_REGELVERK',
}

interface IValidationError {
  type: DocumentValidationErrorType;
  paths: Path[];
}
interface IDocumentValidationError {
  dokumentId: string;
  errors: IValidationError[];
}

export type IValidateDocumentResponse = IDocumentValidationError[];
