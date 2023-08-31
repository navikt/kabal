import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const NONE_SELECTED = 'NONE_SELECTED';

export const UseAsAttachments = () => {
  const { getSelectedDocuments } = useContext(SelectContext);
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const isRol = useIsRol();

  if (oppgaveId === skipToken) {
    return null;
  }

  const options = data
    .filter((d) => {
      if (isRol) {
        return d.parentId === null && d.isSmartDokument && d.templateId === TemplateIdEnum.ROL_NOTAT;
      }

      return d.parentId === null;
    })
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
          journalfoerteDokumenter: getSelectedDocuments(),
        });
      }}
      value={NONE_SELECTED}
    >
      <option key={NONE_SELECTED} value={NONE_SELECTED} label="Velg dokument" />
      {options}
    </Select>
  );
};
