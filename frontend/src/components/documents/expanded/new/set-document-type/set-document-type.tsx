import { Alert, Tag, ToggleGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { OPTIONS_LIST, OPTIONS_MAP } from './options';

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

  const hasJournalfoertVedlegg = data.some(
    (d) => d.parentId === document.id && d.type === DocumentTypeEnum.JOURNALFOERT
  );

  return (
    <>
      <ToggleGroup
        data-testid="document-type-select"
        label="Dokumenttype"
        onChange={onChange}
        value={document.dokumentTypeId}
        size="small"
      >
        {OPTIONS_LIST.map(({ value, label }) => {
          // Journalførte documents cannot be attached to notat.
          if (value === DistribusjonsType.NOTAT && hasJournalfoertVedlegg) {
            return null;
          }

          return (
            <ToggleGroup.Item key={value} value={value}>
              {label}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup>
      {hasJournalfoertVedlegg ? (
        <Alert variant="info" size="small" inline>
          Dokumenter med journalførte vedlegg kan ikke være notat.
        </Alert>
      ) : null}
    </>
  );
};

const DOCUMENT_TYPES = Object.values(DistribusjonsType);

const isDocumentType = (type: string): type is DistribusjonsType => DOCUMENT_TYPES.some((t) => t === type);
