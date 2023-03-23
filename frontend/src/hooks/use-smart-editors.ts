import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetSmartEditorsQuery } from '@app/redux-api/oppgaver/queries/smart-editor';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';

export const useSmartEditors = (oppgaveId: string | typeof skipToken): ISmartEditor[] | undefined => {
  const { data, isLoading } = useGetSmartEditorsQuery(oppgaveId === skipToken ? skipToken : { oppgaveId });

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  return data;
};
