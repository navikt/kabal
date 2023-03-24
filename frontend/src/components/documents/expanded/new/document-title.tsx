import { DocPencilIcon, FileTextIcon } from '@navikt/aksel-icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { IMainDocument } from '@app/types/documents/documents';
import { DocumentTypeEnum } from '../../../show-document/types';
import { EllipsisTitle, StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle } from '../styled-components/document';
import { EditButton } from './document-title-edit-button';
import { SetFilename } from './set-filename';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = ({ document }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();
  const [editMode, setEditMode] = useState(false);

  const isActive =
    typeof value !== 'undefined' && value.type !== DocumentTypeEnum.ARCHIVED && value.documentId === document.id;

  useEffect(() => {
    if (isActive) {
      setValue({
        type: document.isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.FILE,
        documentId: document.id,
      });
    }
  }, [isActive, document.tittel, document.id, setValue, document.isSmartDokument]);

  if (editMode) {
    return (
      <StyledDocumentTitle>
        <SetFilename document={document} onDone={() => setEditMode(false)} />
        <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
      </StyledDocumentTitle>
    );
  }

  const onClick = () =>
    setValue({
      type: document.isSmartDokument ? DocumentTypeEnum.SMART : DocumentTypeEnum.FILE,
      documentId: document.id,
    });

  const Icon = document.isSmartDokument ? StyledNotes : StyledFileContent;

  return (
    <StyledDocumentTitle>
      <StyledDocumentButton isActive={isActive} onClick={onClick} data-testid="document-open-button">
        <Icon />
        <EllipsisTitle title={document.tittel}>{document.tittel}</EllipsisTitle>
      </StyledDocumentButton>
      <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
    </StyledDocumentTitle>
  );
};

const StyledNotes = styled(DocPencilIcon)`
  flex-shrink: 0;
`;

const StyledFileContent = styled(FileTextIcon)`
  flex-shrink: 0;
`;
