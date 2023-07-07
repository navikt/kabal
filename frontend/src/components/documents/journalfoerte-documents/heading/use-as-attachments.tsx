import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { findDocument } from '@app/domain/find-document';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';

const NONE_SELECTED = 'NONE_SELECTED';

export const UseAsAttachments = () => {
  const { selectedDocuments } = useContext(SelectContext);
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const { data: arkiverteDokumenter } = useGetArkiverteDokumenterQuery(oppgaveId);
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();

  if (oppgaveId === skipToken) {
    return null;
  }

  const options = data
    .filter(({ parentId }) => parentId === null)
    .map(({ id, tittel }) => (
      <option value={id} key={id}>
        {tittel}
      </option>
    ));

  return (
    <Select
      size="small"
      label="Bruk som vedlegg for"
      onChange={({ target }) => {
        createVedlegg({
          oppgaveId,
          parentId: target.value,
          journalfoerteDokumenter: Object.values(selectedDocuments)
            .map((d) => findDocument(d.dokumentInfoId, arkiverteDokumenter?.dokumenter ?? []))
            .filter(isNotUndefined),
        });
      }}
      value={NONE_SELECTED}
    >
      <option key={NONE_SELECTED} value={NONE_SELECTED} label="Velg dokument" />
      {options}
    </Select>
  );
};
