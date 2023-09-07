import { Select, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST, OPTIONS_MAP } from '../modal/set-type/options';

interface Props {
  document: IMainDocument;
}

export const SetDocumentType = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const isSaksbehandler = useIsSaksbehandler();

  if (document.parentId !== null) {
    return null;
  }

  if (!isSaksbehandler || document.isMarkertAvsluttet) {
    return (
      <Tag variant="info" size="small">
        {OPTIONS_MAP[document.dokumentTypeId]}
      </Tag>
    );
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
