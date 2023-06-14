import { DocPencilIcon, FilePdfIcon, FilesIcon } from '@navikt/aksel-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { EllipsisTitle, StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle } from '../styled-components/document';
import { TitleAction } from './document-title-action';
import { SetFilename } from './set-filename';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = ({ document }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();
  const [editMode, setEditMode] = useState(false);

  const isActive = useMemo(
    () => value.some((v) => v.type !== DocumentTypeEnum.JOURNALFOERT && v.documentId === document.id),
    [document.id, value]
  );

  const setViewedDocument = useCallback(() => {
    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      setValue({
        type: document.type,
        ...document.journalfoertDokumentReference,
      });

      return;
    }

    setValue({
      type: document.type,
      documentId: document.id,
    });
  }, [document, setValue]);

  useEffect(() => {
    if (isActive) {
      setViewedDocument();
    }
  }, [isActive, setViewedDocument]);

  if (editMode) {
    return (
      <StyledDocumentTitle>
        <SetFilename document={document} onDone={() => setEditMode(false)} />
        <TitleAction
          title={document.tittel}
          isMarkertAvsluttet={document.isMarkertAvsluttet}
          editMode={editMode}
          setEditMode={setEditMode}
          type={document.type}
        />
      </StyledDocumentTitle>
    );
  }

  return (
    <StyledDocumentTitle>
      <StyledDocumentButton isActive={isActive} onClick={setViewedDocument} data-testid="document-open-button">
        <Icon type={document.type} />
        <EllipsisTitle title={document.tittel}>{document.tittel}</EllipsisTitle>
      </StyledDocumentButton>
      <StyledTitleAction
        title={document.tittel}
        isMarkertAvsluttet={document.isMarkertAvsluttet}
        editMode={editMode}
        setEditMode={setEditMode}
        type={document.type}
      />
    </StyledDocumentTitle>
  );
};

const Icon = ({ type }: { type: DocumentTypeEnum }) => {
  switch (type) {
    case DocumentTypeEnum.SMART:
      return <StyledNotes aria-hidden title="Smartdokument" />;
    case DocumentTypeEnum.UPLOADED:
      return <StyledFileContent aria-hidden title="Opplastet dokument" />;
    case DocumentTypeEnum.JOURNALFOERT:
      return <StyledCopiedFile aria-hidden title="Journalført dokument" />;
  }
};

const StyledNotes = styled(DocPencilIcon)`
  flex-shrink: 0;
`;

const StyledFileContent = styled(FilePdfIcon)`
  flex-shrink: 0;
`;

const StyledCopiedFile = styled(FilesIcon)`
  flex-shrink: 0;
`;

const StyledTitleAction = styled(TitleAction)`
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-in-out;

  ${StyledDocumentTitle}:hover & {
    opacity: 1;
  }
`;
