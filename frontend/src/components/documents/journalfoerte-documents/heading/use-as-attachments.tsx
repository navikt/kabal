import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { CreatorRole } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const NONE_SELECTED = 'NONE_SELECTED';

export const UseAsAttachments = () => {
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn } = user;
  const { getSelectedDocuments } = useContext(SelectContext);
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const isFinished = useIsFullfoert();

  const canEdit = hasDocumentsAccess || isRol;

  if (oppgaveId === skipToken || !canEdit) {
    return null;
  }

  const options = data
    .filter((d) => {
      if (isRol) {
        return d.parentId === null && d.isSmartDokument && d.templateId === TemplateIdEnum.ROL_QUESTIONS;
      }

      return d.parentId === null;
    })
    .map(({ id, tittel }) => (
      <option value={id} key={id}>
        {tittel}
      </option>
    ));

  return (
    <Container>
      <Select
        size="small"
        label="Bruk som vedlegg for"
        onChange={({ target }) => {
          createVedlegg({
            oppgaveId,
            parentId: target.value,
            journalfoerteDokumenter: getSelectedDocuments(),
            creator: {
              employee: { navIdent, navn },
              creatorRole: isRol ? CreatorRole.KABAL_ROL : CreatorRole.KABAL_SAKSBEHANDLING,
            },
            isFinished,
          });
        }}
        value={NONE_SELECTED}
      >
        <option key={NONE_SELECTED} value={NONE_SELECTED} label="Velg dokument" />
        {options}
      </Select>
    </Container>
  );
};

const Container = styled.div`
  margin: var(--a-spacing-1) var(--a-spacing-4) var(--a-spacing-3);
`;
