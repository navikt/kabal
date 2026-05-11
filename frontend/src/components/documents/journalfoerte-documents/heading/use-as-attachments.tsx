import { skipToken } from '@reduxjs/toolkit/query';
import { canDistributeAny } from '@/components/documents/filetype';
import { DuaActionEnum } from '@/hooks/dua-access/access';
import { useCreatorRole } from '@/hooks/dua-access/use-creator-role';
import { useLazyDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@/types/arkiverte-documents';
import { DistribusjonsType, DocumentTypeEnum, type IDocument } from '@/types/documents/documents';

export const useOptions = (selectedDocuments: IArkivertDocument[]): IDocument[] => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const getAccess = useLazyDuaAccess();
  const creatorRole = useCreatorRole();

  return data.filter((d) => {
    if (d.parentId !== null) {
      return false; // Cannot attach to attachments.
    }

    if (d.dokumentTypeId !== DistribusjonsType.NOTAT && selectedDocuments.some((s) => !canDistributeAny(s.varianter))) {
      // File types that cannot be distributed, can only be dropped on documents of type NOTAT.
      return false;
    }

    const accessError = getAccess(
      { creator: { creatorRole }, type: DocumentTypeEnum.JOURNALFOERT },
      DuaActionEnum.CREATE,
      d,
    );

    return accessError === null;
  });
};

export const useAttachVedleggFn = () => {
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const isFinished = useIsFullfoert();

  if (oppgaveId === skipToken) {
    return null;
  }

  return (parentId: string, ...vedlegg: IArkivertDocument[]) =>
    createVedlegg({
      oppgaveId,
      parentId,
      journalfoerteDokumenter: vedlegg,
      isFinished,
    });
};
