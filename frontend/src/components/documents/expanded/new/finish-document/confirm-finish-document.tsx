import React from 'react';
import { DocumentType, IMainDocument } from '../../../../../types/documents/documents';
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

  const { tittel, id, dokumentTypeId } = document;
  const willSend = dokumentTypeId !== DocumentType.NOTAT;

  if (willSend) {
    return <SendView dokumentId={id} documentTitle={tittel} close={close} />;
  }

  return <ArchiveView dokumentId={id} documentTitle={tittel} close={close} />;
};
