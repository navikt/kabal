import { Select, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DISTRIBUTION_TYPE_NAMES, DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST } from '../modal/set-type/options';

interface Props {
  document: IMainDocument;
}

export const SetDocumentType = ({ document }: Props) => {
  const { id, dokumentTypeId, isMarkertAvsluttet } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const hasDocumentsAccess = useHasDocumentsAccess();

  if (!hasDocumentsAccess || isMarkertAvsluttet || getIsRolQuestions(document)) {
    return (
      <Tag variant="info" size="small">
        {DISTRIBUTION_TYPE_NAMES[dokumentTypeId]}
      </Tag>
    );
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value) && oppgaveId !== skipToken) {
      setType({ oppgaveId, dokumentId: id, dokumentTypeId: target.value });
    }
  };

  return (
    <Select
      data-testid="document-type-select"
      label="Dokumenttype"
      hideLabel
      size="small"
      onChange={onChange}
      value={dokumentTypeId}
    >
      {OPTIONS_LIST.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};

const DOCUMENT_TYPES = Object.values(DistribusjonsType);

const isDocumentType = (type: string): type is DistribusjonsType => DOCUMENT_TYPES.some((t) => t === type);
