import React, { useContext, useMemo, useState } from 'react';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
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
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const [editMode, setEditMode] = useState(false);

  const isActive = useMemo(
    () =>
      shownDocument !== null &&
      shownDocument.type === DocumentTypeEnum.ARCHIVED &&
      shownDocument.dokumentInfoId === dokumentInfoId &&
      shownDocument.journalpostId === journalpostId,
    [dokumentInfoId, journalpostId, shownDocument]
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
    setShownDocument({
      title: tittel ?? 'Ukjent dokumentnavn',
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
