import { Select, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST, OPTIONS_MAP } from '../modal/set-type/options';

interface Props {
  document: IMainDocument;
}

export const SetDocumentType = ({ document }: Props) => {
  const { id, dokumentTypeId, isMarkertAvsluttet } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const isSaksbehandler = useIsSaksbehandler();

  if (!isSaksbehandler || isMarkertAvsluttet || getIsRolQuestions(document)) {
    return (
      <Tag variant="info" size="small">
        {OPTIONS_MAP[dokumentTypeId]}
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
