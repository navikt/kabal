import { Tag, ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST, OPTIONS_MAP } from './options';

interface Props {
  document: IMainDocument;
}

export const SetDocumentType = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();

  if (document.parentId !== null) {
    return null;
  }

  if (!canEdit || document.isMarkertAvsluttet) {
    return (
      <Tag variant="info" size="medium">
        {OPTIONS_MAP[document.dokumentTypeId]}
      </Tag>
    );
  }

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
