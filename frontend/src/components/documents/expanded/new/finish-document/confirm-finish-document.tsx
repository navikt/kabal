import React from 'react';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { ArchiveView } from './views/archive-view';
import { SendView } from './views/send-view';

interface Props {
  document: IMainDocument;
  close: () => void;
  isOpen: boolean;
}

export const ConfirmFinishDocument = ({ isOpen, close, document }: Props) => {
  if (!isOpen) {
    return null;
  }

  const willSend = document.dokumentTypeId !== DistribusjonsType.NOTAT;

  if (willSend) {
    return <SendView document={document} close={close} />;
  }

  return <ArchiveView document={document} close={close} />;
};
