import { HourglassIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { memo, useContext } from 'react';
import { css, styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useCanDeleteDocument, useCanEditDocument } from '@app/hooks/use-can-edit-document';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  parentDocument?: IMainDocument;
  containsRolAttachments: boolean;
}

export const OpenModalButton = memo<Props>(
  ({ document, parentDocument, containsRolAttachments }) => {
    const isFeilregistrert = useIsFeilregistrert();
    const hasDocumentsAccess = useHasDocumentsAccess();
    const isRol = useIsRol();
    const { setDocument } = useContext(ModalContext);
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
      <StyledButton
        onClick={() => setDocument(document)}
        data-testid="document-actions-button"
        variant="tertiary-neutral"
        size="small"
        icon={<MenuElipsisVerticalIcon aria-hidden />}
      />
    );
  },
  (p, n) =>
    p.document.id === n.document.id &&
    p.parentDocument?.id === n.parentDocument?.id &&
    p.containsRolAttachments === n.containsRolAttachments,
);

OpenModalButton.displayName = 'OpenModalButton';

const GRID_CSS = css`
  grid-area: ${Fields.Action};
`;

const StyledButton = styled(Button)`
  ${GRID_CSS}
`;

const IconContainer = styled.span`
  ${GRID_CSS}
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ArchivingIcon = memo(
  ({ dokumentTypeId }: { dokumentTypeId: DistribusjonsType }) => (
    <IconContainer
      title={
        dokumentTypeId === DistribusjonsType.NOTAT
          ? 'Dokumentet er under journalføring.'
          : 'Dokumentet er under journalføring og utsending.'
      }
      data-testid="document-archiving"
    >
      <HourglassIcon aria-hidden />
    </IconContainer>
  ),
  (p, n) => p.dokumentTypeId === n.dokumentTypeId,
);

ArchivingIcon.displayName = 'ArchivingIcon';
