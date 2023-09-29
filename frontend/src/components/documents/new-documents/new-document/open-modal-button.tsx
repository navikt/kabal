import { HourglassIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { css, styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { useCanDeleteDocument } from '@app/components/documents/new-documents/hooks/use-can-delete-document';
import { useCanEditDocument } from '@app/components/documents/new-documents/hooks/use-can-edit-document';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
}

export const OpenModalButton = ({ document }: Props) => {
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const { setDocument: setDocumentId } = useContext(ModalContext);
  const canEditDocument = useCanEditDocument(document);
  const canDeleteDocument = useCanDeleteDocument(document);

  if (document.isMarkertAvsluttet) {
    return <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />;
  }

  if (isFinished || isFeilregistrert) {
    return null;
  }

  if (!isSaksbehandler && !isRol) {
    return null;
  }

  if (!canEditDocument && !canDeleteDocument) {
    return null;
  }

  return (
    <StyledButton
      onClick={() => setDocumentId(document)}
      data-testid="document-actions-button"
      variant="tertiary-neutral"
      size="small"
      icon={<MenuElipsisVerticalIcon aria-hidden />}
    />
  );
};

const gridCSS = css`
  grid-area: ${Fields.Action};
`;

const StyledButton = styled(Button)`
  ${gridCSS}
`;

const IconContainer = styled.span`
  ${gridCSS}
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArchivingIcon = ({ dokumentTypeId }: { dokumentTypeId: DistribusjonsType }) => (
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
);
