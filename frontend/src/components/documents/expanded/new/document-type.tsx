import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST } from './set-document-type/options';

interface Props {
  document: IMainDocument;
}

export const SetDocumentType = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  if (document.parentId !== null) {
    return null;
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value) && oppgaveId !== skipToken) {
      setType({ oppgaveId, dokumentId: document.id, dokumentTypeId: target.value });
    }
  };

  const hasJournalfoertVedlegg = data.some(
    (d) => d.parentId === document.id && d.type === DocumentTypeEnum.JOURNALFOERT
  );

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
      {OPTIONS_LIST.map(({ label, value }) => {
        // Journalførte documents cannot be attached to notat.
        if (value === DistribusjonsType.NOTAT && hasJournalfoertVedlegg) {
          return null;
        }

        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </Select>
  );
};

const DOCUMENT_TYPES = Object.values(DistribusjonsType);

const isDocumentType = (type: string): type is DistribusjonsType => DOCUMENT_TYPES.some((t) => t === type);
