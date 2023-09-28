import { DocPencilIcon, FilePdfIcon, FilesIcon } from '@navikt/aksel-icons';
import React from 'react';
import { styled } from 'styled-components';
import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@app/types/documents/documents';

export type ModalDocumentType = DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED | DocumentTypeEnum.JOURNALFOERT;

interface Props {
  type: ModalDocumentType;
}

export const DocumentIcon = ({ type }: Props) => {
  switch (type) {
    case DocumentTypeEnum.SMART:
      return <StyledNotes aria-hidden title={DOCUMENT_TYPE_NAMES[type]} />;
    case DocumentTypeEnum.UPLOADED:
      return <StyledFileContent aria-hidden title={DOCUMENT_TYPE_NAMES[type]} />;
    case DocumentTypeEnum.JOURNALFOERT:
      return <StyledCopiedFile aria-hidden title={DOCUMENT_TYPE_NAMES[type]} />;
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
