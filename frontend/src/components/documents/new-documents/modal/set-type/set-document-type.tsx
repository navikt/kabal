import { ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST } from './options';

interface Props {
  document: IMainDocument;
}

export const SetDocumentType = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();

  const onChange = (dokumentTypeId: string) => {
    if (isDocumentType(dokumentTypeId) && oppgaveId !== skipToken) {
      setType({ oppgaveId, dokumentId: document.id, dokumentTypeId });
    }
  };

  return (
    <ToggleGroup
      data-testid="document-type-select"
      label="Dokumenttype"
      onChange={onChange}
      value={document.dokumentTypeId}
      size="small"
    >
      {OPTIONS_LIST.map(({ value, label }) => (
        <ToggleGroup.Item key={value} value={value}>
          {label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup>
  );
};

const DOCUMENT_TYPES = Object.values(DistribusjonsType);

const isDocumentType = (type: string): type is DistribusjonsType => DOCUMENT_TYPES.some((t) => t === type);
