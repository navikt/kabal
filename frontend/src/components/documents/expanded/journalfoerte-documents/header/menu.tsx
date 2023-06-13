import { FilePdfIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { SelectContext } from '@app/components/documents/expanded/journalfoerte-documents/select-context/select-context';
import { findDocument } from '@app/domain/find-document';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetArkiverteDokumenterQuery, useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';

const NONE_SELECTED = 'NONE_SELECTED';
const ENABLE_MERGE_DOCUMENTS = false;

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedDocuments } = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  if (Object.keys(selectedDocuments).length === 0) {
    return null;
  }

  return (
    <StyledMenu ref={ref}>
      <Button
        variant="tertiary-neutral"
        icon={<MenuHamburgerIcon aria-hidden />}
        onClick={() => setIsOpen(!isOpen)}
        size="small"
        title="Verktøy for dokumenter"
      />
      {isOpen && (
        <Dropdown>
          {ENABLE_MERGE_DOCUMENTS ? <ViewCombinedPDF /> : null}
          <UseAsAttachments />
        </Dropdown>
      )}
    </StyledMenu>
  );
};

const StyledMenu = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
  background-color: var(--a-bg-default);
  border-radius: 4px;
  box-shadow: var(--a-shadow-small);
  padding: 0.5rem;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ViewCombinedPDF = () => {
  const { setValue } = useDocumentsPdfViewed();
  const { selectedDocuments } = useContext(SelectContext);

  const onClick = () =>
    setValue(Object.values(selectedDocuments).map((d) => ({ ...d, type: DocumentTypeEnum.JOURNALFOERT })));

  return (
    <Button onClick={onClick} variant="secondary" size="small" icon={<FilePdfIcon />}>
      Vis kombinert dokument
    </Button>
  );
};

const UseAsAttachments = () => {
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
