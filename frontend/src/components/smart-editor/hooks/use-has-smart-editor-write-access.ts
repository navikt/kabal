import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useHasWriteAccess } from '@/components/smart-editor/hooks/use-has-write-access';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentQuery } from '@/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@/types/documents/documents';

export const useHasSmartEditorWriteAccess = (): boolean => {
  const { dokumentId } = useContext(SmartEditorContext);
  const oppgaveId = useOppgaveId();
  const { data: doc } = useGetDocumentQuery(oppgaveId === skipToken ? skipToken : { oppgaveId, dokumentId });

  return useHasWriteAccess(doc === undefined || doc.type !== DocumentTypeEnum.SMART ? null : doc);
};
