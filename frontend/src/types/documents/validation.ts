import { Path } from 'slate';

export enum DocumentValidationErrorType {
  EMPTY_PLACEHOLDERS = 'EMPTY_PLACEHOLDERS',
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
