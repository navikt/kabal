import { ListTagTypes } from '../../tag-types';
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';

export const getInvalidateAction = (oppgaveId: string) =>
  oppgaverApi.util.invalidateTags([
    { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: oppgaveId },
    { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
    { type: OppgaveListTagTypes.ENHETENS_TILDELTE_OPPGAVER, id: oppgaveId },
    { type: OppgaveListTagTypes.ENHETENS_TILDELTE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
  ]);
