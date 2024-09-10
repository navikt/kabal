import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router-dom';

export const useOppgaveId = (): string | typeof skipToken => {
  const { oppgaveId } = useParams();

  if (oppgaveId === undefined || oppgaveId.length === 0) {
    console.error('Cannot use useOppgaveId outside of oppgave context');

    return skipToken;
  }

  return oppgaveId;
};
