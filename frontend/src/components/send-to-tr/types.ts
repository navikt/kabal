import type { IYtelse } from '@/types/kodeverk';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

export type AnkeFormFields = {
  fagsakId: string;
  sakMottattKlageinstans: string | null;
  sendtTilTrygderetten: string | null;
  hjemmelIdList: string[];
  gosysOppgaveId: number;
};

export interface RegisteredAnke {
  ankeId: string;
  fnr: string;
  ytelse: IYtelse;
  fields: AnkeFormFields;
  gosysOppgave: ListGosysOppgave | undefined;
}
