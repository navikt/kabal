import { Path } from 'slate';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';

export interface IDocumentParams extends IOppgavebehandlingBaseParams {
  dokumentId: string;
}

export enum DocumentValidationErrorType {
  EMPTY_PLACEHOLDERS = 'EMPTY_PLACEHOLDERS',
}

interface IDocumentValidationError {
  type: DocumentValidationErrorType;
  paths: Path[];
}

export interface IValidateDocumentResponse {
  errors: IDocumentValidationError[];
}
