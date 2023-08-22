import { HourglassIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
}

export const ToggleModalButton = ({ document }: Props) => {
  const canEdit = useCanEdit();
  const { setDocumentId } = useContext(ModalContext);

  if (!canEdit) {
    return null;
  }

  const onClick = () => setDocumentId(document.id);

  return (
    <StyledButton
      onClick={onClick}
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
