import { Alert, ToggleGroup } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

const IS_PARENT_DOCUMENT = 'PARENT_DOCUMENT_VALUE';

interface Props {
  document: IMainDocument;
}

export const SetParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: isLoadingDocuments } = useGetDocumentsQuery(oppgaveId);
  const [setParent] = useSetParentMutation();

  const potentialParents = useMemo(() => {
    if (typeof data === 'undefined') {
      return [];
    }

    return data.filter(({ id, parentId }) => document.id !== id && parentId === null);
  }, [data, document.id]);

  if (isLoadingDocuments || typeof data === 'undefined' || potentialParents.length === 0) {
    return null;
  }

  const onChange = (id: string) => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    setParent({ dokumentId: document.id, oppgaveId, parentId: id === IS_PARENT_DOCUMENT ? null : id });
  };

  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;

  return (
    <>
      <ToggleGroup
        size="small"
        value={document.parentId ?? IS_PARENT_DOCUMENT}
        onChange={onChange}
        title="Vedlegg til"
        label="Vedlegg til"
        data-testid="document-set-parent-document"
      >
        {isJournalfoert ? null : (
          <ToggleGroup.Item key={document.parentId} value={IS_PARENT_DOCUMENT}>
            <DocumentIcon type={document.type} />
            Hoveddokument
          </ToggleGroup.Item>
        )}
        {potentialParents.map(({ tittel, id, type }) => (
          <ToggleGroup.Item key={id} value={id}>
            <DocumentIcon type={type} />
            {tittel}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup>
      {isJournalfoert ? (
        <Alert variant="info" size="small" inline>
          Journalførte dokumenter kan kun være vedlegg.
        </Alert>
      ) : null}
    </>
  );
};
