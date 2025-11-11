import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router-dom';

/** Returns oppgave ID. Logs an error if used outside of oppgave context. */
export const useOppgaveId = (): string | typeof skipToken => {
  const oppgaveId = useMaybeOppgaveId();

  if (oppgaveId === null) {
    console.error('Cannot use useOppgaveId outside of oppgave context');

    return skipToken;
  }

  return oppgaveId;
};

/** Returns oppgave ID, if any oppgave is open. Otherwise null. */
export const useMaybeOppgaveId = (): string | null => {
  const { oppgaveId } = useParams();

  if (oppgaveId === undefined || oppgaveId.length === 0) {
    return null;
  }

  return oppgaveId;
};
