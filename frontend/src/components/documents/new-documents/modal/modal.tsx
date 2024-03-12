import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { useCanDeleteDocument } from '@app/hooks/use-can-document/use-can-delete-document';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  parentDocument?: IMainDocument;
  containsRolAttachments: boolean;
}

export const DocumentModal = ({ document, parentDocument, containsRolAttachments }: Props) => {
  const { tittel, type } = document;
  const isFeilregistrert = useIsFeilregistrert();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const isRol = useIsRol();
  const [open, setOpen] = useState(false);
  const { close } = useContext(ModalContext);

  const canEditDocument = useCanEditDocument(document, parentDocument);
  const canDeleteDocument = useCanDeleteDocument(document, containsRolAttachments, parentDocument);

  if (isFeilregistrert) {
    return null;
  }

  if (!hasDocumentsAccess && !isRol) {
    return null;
  }

  if (!canEditDocument && !canDeleteDocument) {
    return null;
  }

  return (
    <>
      <StyledButton
        onClick={() => setOpen(!open)}
        data-testid="document-actions-button"
        variant="tertiary-neutral"
        size="small"
        icon={<MenuElipsisVerticalIcon aria-hidden />}
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

const StyledButton = styled(Button)`
  grid-area: ${Fields.Action};
`;
