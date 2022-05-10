import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useParams } from 'react-router-dom';

export const useOppgaveId = (): string | typeof skipToken => {
  const { id } = useParams();

  if (typeof id !== 'string' || id.length === 0) {
    return skipToken;
  }

  return id;
};
