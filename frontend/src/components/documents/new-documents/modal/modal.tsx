import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-content';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { useCanDeleteDocument, useCanEditDocument } from '@app/hooks/use-can-edit-document';
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
          width="medium"
          aria-modal
          data-testid="document-actions-modal"
          header={{
            heading: `Valg for «${tittel}»`,
            icon: <DocumentIcon type={type} />,
          }}
          closeOnBackdropClick
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
