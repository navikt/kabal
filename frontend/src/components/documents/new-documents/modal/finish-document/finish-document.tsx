import React from 'react';
import { ArchiveView } from '@app/components/documents/new-documents/modal/finish-document/views/archive-view';
import { SendView } from '@app/components/documents/new-documents/modal/finish-document/views/send-view';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
}

export const FinishDocument = ({ document }: Props) => {
  const canEdit = useCanEdit();

  if (!canEdit || document.isMarkertAvsluttet || document.parentId !== null) {
    return null;
  }

  const willSend = document.dokumentTypeId !== DistribusjonsType.NOTAT;

  if (willSend) {
    return <SendView document={document} />;
  }

  return <ArchiveView document={document} />;
};
