import React, { useMemo, useState } from 'react';
import { useDocumentsPdfViewed } from '../../../../hooks/settings/use-setting';
import { DocumentTypeEnum } from '../../../show-document/types';
import { EllipsisTitle, StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle } from '../styled-components/document';
import { EditButton } from './document-title-edit-button';
import { SetFilename } from './set-filename';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
}

export const DocumentTitle = ({ journalpostId, dokumentInfoId, tittel }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();

  const [editMode, setEditMode] = useState(false);

  const isActive = useMemo(
    () =>
      typeof value !== 'undefined' &&
      value.type === DocumentTypeEnum.ARCHIVED &&
      value.dokumentInfoId === dokumentInfoId &&
      value.journalpostId === journalpostId,
    [dokumentInfoId, journalpostId, value]
  );

  if (editMode) {
    return (
      <StyledDocumentTitle>
        <SetFilename
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          tittel={tittel}
          onDone={() => setEditMode(false)}
        />
        <EditButton editMode={editMode} setEditMode={setEditMode} />
      </StyledDocumentTitle>
    );
  }

  const onClick = () =>
    setValue({
      type: DocumentTypeEnum.ARCHIVED,
      dokumentInfoId,
      journalpostId,
    });

  return (
    <StyledDocumentTitle>
      <StyledDocumentButton isActive={isActive} onClick={onClick} data-testid="document-open-button">
        <EllipsisTitle title={tittel}>{tittel}</EllipsisTitle>
      </StyledDocumentButton>
      <EditButton editMode={editMode} setEditMode={setEditMode} />
    </StyledDocumentTitle>
  );
};
