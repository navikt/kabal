import { Select } from 'nav-frontend-skjema';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useSetTypeMutation } from '../../../../redux-api/documents';
import { DocumentType, IMainDocument } from '../../../../types/documents';

const OPTIONS = [
  {
    label: 'Vedtaksbrev',
    value: DocumentType.VEDTAKSBREV,
  },
  {
    label: 'Beslutningsbrev',
    value: DocumentType.BESLUTNING,
  },
  {
    label: 'Brev',
    value: DocumentType.BREV,
  },
  {
    label: 'Notat',
    value: DocumentType.NOTAT,
  },
];

interface Props {
  document: IMainDocument;
}

export const DocumentTypeOrFrikoble = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();

  if (document.isMarkertAvsluttet) {
    return <Avsluttet document={document} />;
  }

  if (document.parent !== null) {
    return null;
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value)) {
      setType({ oppgaveId, dokumentId: document.id, dokumentTypeId: target.value });
    }
  };

  const options = OPTIONS.map(({ label, value }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));

  return (
    <StyledSelect value={document.dokumentTypeId} onChange={onChange} disabled={!canEdit}>
      {options}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const DOCUMENT_TYPES = Object.values(DocumentType);

const isDocumentType = (type: string): type is DocumentType => DOCUMENT_TYPES.some((t) => t === type);

const Avsluttet = ({ document }: Props) => {
  if (document.parent !== null) {
    return null;
  }

  const docType = OPTIONS.find((option) => option.value === document.dokumentTypeId)?.label;

  if (typeof docType === 'undefined') {
    return null;
  }

  return <StyledAvsluttet>{docType}</StyledAvsluttet>;
};

const StyledAvsluttet = styled.div`
  background: #f1f1f1;
  color: #262626;
  border-radius: 4px;
  border: 1px solid #6a6a6a;
  padding: 0.5rem;
`;
