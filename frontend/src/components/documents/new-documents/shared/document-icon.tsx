import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@app/types/documents/documents';
import { DocPencilIcon, FilePdfIcon, FilesIcon } from '@navikt/aksel-icons';
import { memo } from 'react';
import { styled } from 'styled-components';

export type ModalDocumentType = DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED | DocumentTypeEnum.JOURNALFOERT;

interface Props {
  type: ModalDocumentType;
}

export const DocumentIcon = memo<Props>(
  ({ type }) => {
    switch (type) {
      case DocumentTypeEnum.SMART:
        return <StyledNotes aria-hidden title={DOCUMENT_TYPE_NAMES[type]} />;
      case DocumentTypeEnum.UPLOADED:
        return <StyledFileContent aria-hidden title={DOCUMENT_TYPE_NAMES[type]} />;
      case DocumentTypeEnum.JOURNALFOERT:
        return <StyledCopiedFile aria-hidden title={DOCUMENT_TYPE_NAMES[type]} />;
    }
  },
  (prevProps, nextProps) => prevProps.type === nextProps.type,
);

DocumentIcon.displayName = 'DocumentIcon';

const StyledNotes = styled(DocPencilIcon)`
  flex-shrink: 0;
`;

const StyledFileContent = styled(FilePdfIcon)`
  flex-shrink: 0;
`;

const StyledCopiedFile = styled(FilesIcon)`
  flex-shrink: 0;
`;
