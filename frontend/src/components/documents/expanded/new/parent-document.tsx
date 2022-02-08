import { Select } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery, useSetParentMutation } from '../../../../redux-api/documents';
import { IMainDocument } from '../../../../types/documents';

const NONE_SELECTED = 'NONE_SELECTED';

interface Props {
  document: IMainDocument;
}

export const ParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery({ oppgaveId });
  const [setParent] = useSetParentMutation();

  const hasAttachments = useMemo(() => {
    if (typeof data === 'undefined') {
      return true;
    }

    return data.some(({ parent }) => parent === document.id);
  }, [data, document.id]);

  const options = useMemo(() => {
    if (hasAttachments || typeof data === 'undefined') {
      return [];
    }

    return data
      .filter(({ id, parent }) => document.id !== id && document.parent !== id && parent === null)
      .map(({ tittel, id }) => (
        <option key={id} value={id}>
          {tittel}
        </option>
      ));
  }, [hasAttachments, data, document.id, document.parent]);

  if (hasAttachments || isLoading || typeof data === 'undefined') {
    return null;
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) =>
    setParent({ dokumentId: document.id, oppgaveId, parentId: target.value === NONE_SELECTED ? null : target.value });

  const currentOption =
    document.parent === null ? null : (
      <option key={document.parent} value={document.parent}>
        {data.find(({ id }) => document.parent === id)?.tittel ?? 'Ukjent dokument'}
      </option>
    );

  return (
    <StyledSelect
      value={document.parent ?? NONE_SELECTED}
      onChange={onChange}
      title="Gjør til vedlegg for"
      disabled={options.length === 0}
    >
      <option key={NONE_SELECTED} value={NONE_SELECTED}>
        {getText(document)}
      </option>
      <optgroup label="Gjør til vedlegg for">
        {currentOption}
        {options}
      </optgroup>
    </StyledSelect>
  );
};

const getText = ({ parent }: IMainDocument) => (parent === null ? 'Hoveddokument' : 'Gjør til hoveddokument');

const StyledSelect = styled(Select)`
  width: 100%;
  cursor: pointer;
`;
