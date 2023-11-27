import { Loader } from '@navikt/ds-react';
import React, { memo, useContext } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { StyledDocumentList } from '../styled-components/document-list';
import { DocumentListItem } from './document-list-item';

interface Props {
  documents: IArkivertDocument[];
  isLoading: boolean;
}

export const DocumentList = memo(
  ({ documents, isLoading }: Props) => {
    const { isSelected } = useContext(SelectContext);

    return (
      <StyledDocumentList data-testid="oppgavebehandling-documents-all-list" style={{ overflowY: 'auto' }}>
        <DocumentsSpinner hasDocuments={!isLoading} />
        {documents.map((document) => (
          <DocumentListItem
            key={`dokument_${document.journalpostId}_${document.dokumentInfoId}`}
            document={document}
            isSelected={isSelected(document)}
          />
        ))}
      </StyledDocumentList>
    );
  },
  (prevProps, nextProps) => prevProps.documents === nextProps.documents,
);

DocumentList.displayName = 'DocumentList';

interface DocumentsSpinnerProps {
  hasDocuments: boolean;
}

const DocumentsSpinner = ({ hasDocuments }: DocumentsSpinnerProps): JSX.Element | null => {
  if (hasDocuments) {
    return null;
  }

  return <Loader size="xlarge" />;
};
