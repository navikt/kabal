import { Fields } from '@app/components/documents/new-documents/grid';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import type { IMainDocument } from '@app/types/documents/documents';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useContext, useState } from 'react';

interface Props {
  document: IMainDocument;
  parentDocument?: IMainDocument;
  containsRolAttachments: boolean;
}

export const DocumentModal = ({ document, parentDocument, containsRolAttachments }: Props) => {
  const { tittel, type } = document;
  const [open, setOpen] = useState(false);
  const { close } = useContext(ModalContext);

  const canEditDocument = useCanEditDocument(document, parentDocument);

  if (!canEditDocument) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        data-testid="document-actions-button"
        variant="tertiary-neutral"
        size="small"
        icon={<MenuElipsisVerticalIcon aria-hidden />}
        style={{ gridArea: Fields.Action }}
      />
      {open ? (
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
            setOpen(false);
          }}
        >
          <DocumentModalContent
            document={document}
            parentDocument={parentDocument}
            containsRolAttachments={containsRolAttachments}
          />
        </Modal>
      ) : null}
    </>
  );
};
