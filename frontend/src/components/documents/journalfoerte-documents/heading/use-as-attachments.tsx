import { Loader, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';

const NONE_SELECTED = 'NONE_SELECTED';

export const UseAsAttachments = () => {
  const { getSelectedDocuments } = useContext(SelectContext);
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const [createVedlegg, { isLoading }] = useCreateVedleggFromJournalfoertDocumentMutation();

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
      label={
        <StyledLabel>Bruk som vedlegg for {isLoading ? <Loader title="Laster..." size="xsmall" /> : null}</StyledLabel>
      }
      disabled={isLoading}
      onChange={async ({ target }) => {
        const journalfoerteDokumenter = await getSelectedDocuments();

        createVedlegg({ oppgaveId, parentId: target.value, journalfoerteDokumenter });
      }}
      value={NONE_SELECTED}
    >
      <option key={NONE_SELECTED} value={NONE_SELECTED} label="Velg dokument" />
      {options}
    </Select>
  );
};

const StyledLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
