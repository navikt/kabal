import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@app/types/documents/documents';
import { DocPencilIcon, FilePdfIcon, FilesIcon } from '@navikt/aksel-icons';
import { memo } from 'react';

export type ModalDocumentType = DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED | DocumentTypeEnum.JOURNALFOERT;

interface Props {
  type: ModalDocumentType;
}

export const DocumentIcon = memo<Props>(
  ({ type }) => {
    switch (type) {
      case DocumentTypeEnum.SMART:
        return <DocPencilIcon aria-hidden title={DOCUMENT_TYPE_NAMES[type]} className="shrink-0" />;
      case DocumentTypeEnum.UPLOADED:
        return <FilePdfIcon aria-hidden title={DOCUMENT_TYPE_NAMES[type]} className="shrink-0" />;
      case DocumentTypeEnum.JOURNALFOERT:
        return <FilesIcon aria-hidden title={DOCUMENT_TYPE_NAMES[type]} className="shrink-0" />;
    }
  },
  (prevProps, nextProps) => prevProps.type === nextProps.type,
);

DocumentIcon.displayName = 'DocumentIcon';
