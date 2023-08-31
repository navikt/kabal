import { Modal } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
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

  const { tittel, type } = document;

  return (
    <Modal
      width="medium"
      open={documentId !== null}
      aria-modal
      onClose={close}
      onCancel={close}
      data-testid="document-actions-modal"
      header={{
        heading: `Valg for «${tittel}»`,
        icon: <DocumentIcon type={type} />,
      }}
    >
      <DocumentModalContent document={document} />
    </Modal>
  );
};
