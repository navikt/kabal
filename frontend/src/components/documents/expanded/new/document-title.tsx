import { FileContent, Notes } from '@navikt/ds-icons';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { DOMAIN, KABAL_BEHANDLINGER_BASE_PATH } from '../../../../redux-api/common';
import { IMainDocument } from '../../../../types/documents';
import { ShownDocumentContext } from '../../context';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle } from '../styled-components/document';
import { EditButton } from './document-title-edit-button';
import { SetFilename } from './set-filename';

interface Props {
  document: IMainDocument;
}

export const DocumentTitle = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const [editMode, setEditMode] = useState(false);

  const url = useMemo(() => getURL(oppgaveId, document), [oppgaveId, document]);

  const isActive = shownDocument?.url === url;

  useEffect(() => {
    if (isActive) {
      setShownDocument({
        title: document.tittel,
        url,
        documentId: document.id,
      });
    }
  }, [isActive, url, document.tittel, document.id, setShownDocument]);

  if (editMode) {
    return (
      <StyledDocumentTitle>
        <SetFilename document={document} onDone={() => setEditMode(false)} />
        <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
      </StyledDocumentTitle>
    );
  }

  const onClick = () =>
    setShownDocument({
      title: document.tittel,
      url,
      documentId: document.id,
    });

  const Icon = document.isSmartDokument ? Notes : FileContent;

  return (
    <StyledDocumentTitle>
      <StyledDocumentButton isActive={isActive} onClick={onClick} data-testid="document-open-button">
        <Icon />
        {document.tittel}
      </StyledDocumentButton>
      <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
    </StyledDocumentTitle>
  );
};

const getURL = (oppgaveId: string, { id }: IMainDocument) =>
  `${DOMAIN}${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/${id}/pdf`;
