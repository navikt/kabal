import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DocumentType, IMainDocument } from '@app/types/documents/documents';

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

export const SetDocumentType = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();

  if (document.parent !== null) {
    return null;
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value) && oppgaveId !== skipToken) {
      setType({ oppgaveId, dokumentId: document.id, dokumentTypeId: target.value });
    }
  };

  return (
    <Select
      data-testid="document-type-select"
      label="Dokumenttype"
      hideLabel
      size="small"
      onChange={onChange}
      value={document.dokumentTypeId}
      disabled={!canEdit || document.isMarkertAvsluttet}
    >
      {OPTIONS.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};

const DOCUMENT_TYPES = Object.values(DocumentType);

const isDocumentType = (type: string): type is DocumentType => DOCUMENT_TYPES.some((t) => t === type);
