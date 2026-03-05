import type { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';

export interface IDocumentParams extends IOppgavebehandlingBaseParams {
  dokumentId: string;
}
