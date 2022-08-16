import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useSetParentMutation } from '../../../../redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { IMainDocument } from '../../../../types/documents/documents';

const NONE_SELECTED = 'NONE_SELECTED';

interface Props {
  document: IMainDocument;
}

export const SetParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: isLoadingDocuments } = useGetDocumentsQuery(
    oppgaveId === skipToken ? skipToken : { oppgaveId }
  );
  const [setParent, { isLoading: isSettingParent }] = useSetParentMutation();

  const hasAttachments = useMemo(() => {
    if (typeof data === 'undefined') {
      return true;
    }

    return data.some(({ parent }) => parent === document.id);
  }, [data, document.id]);

  const potentialParents = useMemo(() => {
    if (hasAttachments || typeof data === 'undefined') {
      return [];
    }

    return data
      .filter(({ id, parent }) => document.id !== id && document.parent !== id && parent === null)
      .map(({ tittel, id }) => <option key={id} value={id} label={tittel} />);
  }, [hasAttachments, data, document.id, document.parent]);

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
    document.parent === null ? null : (
      <option
        key={document.parent}
        value={document.parent}
        label={data.find(({ id }) => document.parent === id)?.tittel ?? 'Ukjent dokument'}
      />
    );

  return (
    <Select
      size="small"
      value={document.parent ?? NONE_SELECTED}
      onChange={onChange}
      title="Gjør til vedlegg for"
      label="Gjør til vedlegg for"
      disabled={isSettingParent}
      data-testid="document-set-parent-document"
      hideLabel
    >
      <option key={NONE_SELECTED} value={NONE_SELECTED} label={getText(document)} />
      <optgroup label="Gjør til vedlegg for">
        {currentOption}
        {potentialParents}
      </optgroup>
    </Select>
  );
};

const getText = ({ parent }: IMainDocument) => (parent === null ? 'Hoveddokument' : 'Gjør til hoveddokument');
