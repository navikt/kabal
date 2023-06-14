import { Select } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

const NONE_SELECTED = 'NONE_SELECTED';

interface Props {
  document: IMainDocument;
}

export const SetParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: isLoadingDocuments } = useGetDocumentsQuery(oppgaveId);
  const [setParent, { isLoading: isSettingParent }] = useSetParentMutation();

  const hasAttachments = useMemo(() => {
    if (typeof data === 'undefined') {
      return true;
    }

    return data.some(({ parentId }) => parentId === document.id);
  }, [data, document.id]);

  const potentialParents = useMemo(() => {
    if (hasAttachments || typeof data === 'undefined') {
      return [];
    }

    return data
      .filter(({ id, parentId }) => document.id !== id && document.parentId !== id && parentId === null)
      .map(({ tittel, id }) => <option key={id} value={id} label={tittel} />);
  }, [hasAttachments, data, document.id, document.parentId]);

  if (hasAttachments || isLoadingDocuments || typeof data === 'undefined') {
    return null;
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    setParent({ dokumentId: document.id, oppgaveId, parentId: target.value === NONE_SELECTED ? null : target.value });
  };

  const currentOption =
    document.parentId === null ? null : (
      <option
        key={document.parentId}
        value={document.parentId}
        label={data.find(({ id }) => document.parentId === id)?.tittel ?? 'Ukjent dokument'}
      />
    );

  if (currentOption === null && potentialParents.length === 0) {
    return null;
  }

  return (
    <Select
      size="small"
      value={document.parentId ?? NONE_SELECTED}
      onChange={onChange}
      title="Vedlegg til"
      label="Vedlegg til"
      disabled={isSettingParent}
      data-testid="document-set-parent-document"
    >
      {document.type === DocumentTypeEnum.JOURNALFOERT ? null : (
        <option key={NONE_SELECTED} value={NONE_SELECTED} label={getText(document)} />
      )}
      {currentOption}
      {potentialParents}
    </Select>
  );
};

const getText = ({ parentId }: IMainDocument) => (parentId === null ? 'Hoveddokument' : 'Gjør til hoveddokument');
