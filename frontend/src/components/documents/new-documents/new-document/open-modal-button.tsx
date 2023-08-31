import { HourglassIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
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
  const { setDocumentId } = useContext(ModalContext);

  if (isFinished || isFeilregistrert) {
    return null;
  }

  if (!isSaksbehandler && !isRol) {
    return null;
  }

  return (
    <StyledButton
      onClick={() => setDocumentId(document.id)}
      data-testid="document-actions-button"
      variant="tertiary-neutral"
      size="small"
      icon={<Icon {...document} />}
    />
  );
};

const StyledButton = styled(Button)`
  grid-area: ${Fields.Action};
`;

const Icon = ({ isMarkertAvsluttet, dokumentTypeId }: IMainDocument) => {
  if (isMarkertAvsluttet) {
    if (dokumentTypeId === DistribusjonsType.NOTAT) {
      return <HourglassIcon title="Dokumentet er under journalføring." data-testid="document-archiving" aria-hidden />;
    }

    return (
      <HourglassIcon
        title="Dokumentet er under journalføring og utsending."
        data-testid="document-archiving"
        aria-hidden
      />
    );
  }

  return <MenuElipsisVerticalIcon aria-hidden />;
};
