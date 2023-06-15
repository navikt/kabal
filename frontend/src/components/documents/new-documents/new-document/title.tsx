import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { EllipsisTitle, StyledDocumentButton } from '../../styled-components/document-button';
import { SetFilename } from '../shared/set-filename';
import { TitleAction } from './title-action';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = ({ document }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();
  const [editMode, setEditMode] = useState(false);
  const [isExpanded] = useIsExpanded();

  const isActive = useMemo(
    () =>
      value.some((v) => {
        if (document.type === DocumentTypeEnum.JOURNALFOERT) {
          return (
            v.type === DocumentTypeEnum.JOURNALFOERT &&
            v.journalpostId === document.journalfoertDokumentReference.journalpostId &&
            v.dokumentInfoId === document.journalfoertDokumentReference.dokumentInfoId
          );
        }

        return v.type === document.type && v.documentId === document.id;
      }),
    [document, value]
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
        <SetFilename autoFocus hideLabel document={document} onDone={() => setEditMode(false)} />
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
        <DocumentIcon type={document.type} />
        <EllipsisTitle title={document.tittel}>{document.tittel}</EllipsisTitle>
      </StyledDocumentButton>
      {isExpanded ? (
        <StyledTitleAction
          title={document.tittel}
          isMarkertAvsluttet={document.isMarkertAvsluttet}
          editMode={editMode}
          setEditMode={setEditMode}
          type={document.type}
        />
      ) : null}
    </StyledDocumentTitle>
  );
};

const StyledDocumentTitle = styled.h1`
  grid-area: ${Fields.Title};
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  font-size: 18px;
  font-weight: normal;
  margin: 0;
  color: #0067c5;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
`;

const StyledTitleAction = styled(TitleAction)`
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-in-out;

  ${StyledDocumentTitle}:hover & {
    opacity: 1;
  }
`;
