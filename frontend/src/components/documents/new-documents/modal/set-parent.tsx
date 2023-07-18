import { Alert, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
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
      <RadioGroup
        size="small"
        value={document.parentId ?? IS_PARENT_DOCUMENT}
        onChange={onChange}
        title="Vedlegg til"
        legend="Vedlegg til"
        data-testid="document-set-parent-document"
      >
        {isJournalfoert ? null : (
          <RadioOption key={document.parentId} value={IS_PARENT_DOCUMENT} type={document.type} text="Hoveddokument" />
        )}
        {potentialParents.map(({ tittel, id, type }) => (
          <RadioOption key={id} value={id} type={type} text={tittel} />
        ))}
      </RadioGroup>
      {isJournalfoert ? (
        <Alert variant="info" size="small" inline>
          Journalførte dokumenter kan kun være vedlegg.
        </Alert>
      ) : null}
    </>
  );
};

interface RadioOptionProps {
  value: string;
  type: DocumentTypeEnum;
  text: string;
}

const RadioOption = ({ value, type, text }: RadioOptionProps) => (
  <Radio key={value} value={value} title={text}>
    <RadioContent>
      <DocumentIcon type={type} />
      <RadioText>{text}</RadioText>
    </RadioContent>
  </Radio>
);

const RadioContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  column-gap: 4px;
`;

const RadioText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
