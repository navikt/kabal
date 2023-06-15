import { ToggleGroup } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

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

    return data.filter(
      ({ id, parentId, dokumentTypeId }) =>
        document.id !== id &&
        document.parentId !== id &&
        parentId === null &&
        (document.type !== DocumentTypeEnum.JOURNALFOERT || dokumentTypeId !== DistribusjonsType.NOTAT)
    );
  }, [data, document.id, document.parentId, document.type]);

  if (isLoadingDocuments || typeof data === 'undefined' || potentialParents.length === 0) {
    return null;
  }

  const onChange = (id: string) => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    setParent({ dokumentId: document.id, oppgaveId, parentId: id === IS_PARENT_DOCUMENT ? null : id });
  };

  return (
    <ToggleGroup
      size="small"
      value={document.parentId ?? IS_PARENT_DOCUMENT}
      onChange={onChange}
      title="Vedlegg til"
      label="Vedlegg til"
      data-testid="document-set-parent-document"
    >
      <ToggleGroup.Item key={document.parentId} value={IS_PARENT_DOCUMENT}>
        Hoveddokument
      </ToggleGroup.Item>
      {potentialParents.map(({ tittel, id }) => (
        <ToggleGroup.Item key={id} value={id}>
          {tittel}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup>
  );
};
