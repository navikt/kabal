import { Fields } from '@app/components/documents/new-documents/grid';
import { AttachmentModalContent } from '@app/components/documents/new-documents/modal/modal-attachment-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-document-content';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import type { AttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import type { DocumentAccess } from '@app/hooks/dua-access/use-document-access';
import type { IMainDocument } from '@app/types/documents/documents';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  document: IMainDocument;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface DocumentProps extends Props {
  access: DocumentAccess;
}

export const DocumentModal = ({ document, isOpen, setIsOpen, access }: DocumentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);

  if (!access.read || !(access.rename || access.changeType || access.remove)) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="document-actions-button"
        variant="tertiary-neutral"
        size="small"
        icon={<MenuElipsisVerticalIcon aria-hidden />}
        style={{ gridArea: Fields.Action }}
      />
      {isOpen ? (
        <Modal
          open
          width={document.parentId === null ? '2000px' : '600px'}
          aria-modal
          data-testid="document-actions-modal"
          header={{
            heading: `Valg for «${tittel}»`,
            icon: <DocumentIcon type={type} />,
          }}
          closeOnBackdropClick
          onClose={() => {
            close();
            setIsOpen(false);
          }}
        >
          <DocumentModalContent document={document} access={access} />
        </Modal>
      ) : null}
    </>
  );
};

interface AttachmentProps extends Props {
  access: AttachmentAccess;
}

export const AttachmentModal = ({ document, isOpen, setIsOpen, access }: AttachmentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);

  if (!access.read || !(access.rename || access.move || access.remove)) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="document-actions-button"
        variant="tertiary-neutral"
        size="small"
        icon={<MenuElipsisVerticalIcon aria-hidden />}
        style={{ gridArea: Fields.Action }}
      />
      {isOpen ? (
        <Modal
          open
          width="600px"
          aria-modal
          data-testid="document-actions-modal"
          header={{
            heading: `Valg for «${tittel}»`,
            icon: <DocumentIcon type={type} />,
          }}
          closeOnBackdropClick
          onClose={() => {
            close();
            setIsOpen(false);
          }}
        >
          <AttachmentModalContent document={document} access={access} />
        </Modal>
      ) : null}
    </>
  );
};
