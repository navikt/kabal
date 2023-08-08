import { Loader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { IJournalpostReference } from '@app/types/documents/documents';
import { StyledDocumentList } from '../styled-components/document-list';
import { DocumentListItem } from './document-list-item';

interface Props {
  journalpostReferenceList: IJournalpostReference[];
  isLoading: boolean;
}

export const DocumentList = ({ journalpostReferenceList, isLoading }: Props) => {
  const { isSelected } = useContext(SelectContext);

  return (
    <StyledDocumentList data-testid="oppgavebehandling-documents-all-list">
      <DocumentsSpinner hasDocuments={!isLoading} />
      {journalpostReferenceList.map((j) => (
        <DocumentListItem
          key={`${j.journalpostId}-${j.dokumentInfoId}`}
          journalpostReference={j}
          isSelected={isSelected(j)}
        />
      ))}
    </StyledDocumentList>
  );
};

interface DocumentsSpinnerProps {
  hasDocuments: boolean;
}

const DocumentsSpinner = ({ hasDocuments }: DocumentsSpinnerProps): JSX.Element | null => {
  if (hasDocuments) {
    return null;
  }

  return <Loader size="xlarge" />;
};
