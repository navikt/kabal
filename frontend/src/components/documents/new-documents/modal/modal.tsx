import { Modal } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';

export const DocumentModal = () => {
  const oppgaveId = useOppgaveId();
  const { documentId, close } = useContext(ModalContext);
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  const document = data.find(({ id }) => id === documentId);

  if (typeof document === 'undefined') {
    return null;
  }

  const titleId = `modal-title-${documentId}`;

  return (
    <Modal
      width="medium"
      open={documentId !== null}
      aria-modal
      aria-labelledby={titleId}
      onClose={close}
      onCancel={close}
    >
      <DocumentModalContent document={document} titleId={titleId} />
    </Modal>
  );
};
