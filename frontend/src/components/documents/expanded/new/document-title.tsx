import React, { useContext, useEffect, useMemo } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { DOMAIN, KABAL_BEHANDLINGER_BASE_PATH } from '../../../../redux-api/common';
import { IMainDocument } from '../../../../types/documents';
import { ShownDocumentContext } from '../../context';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { SetFilename } from './filename';

interface Props {
  document: IMainDocument;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export const DocumentTitle = ({ document, editMode, setEditMode }: Props) => {
  const oppgaveId = useOppgaveId();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const url = useMemo(() => getURL(oppgaveId, document), [oppgaveId, document]);

  const isActive = shownDocument?.url === url;

  useEffect(() => {
    if (isActive) {
      setShownDocument({
        title: document.tittel,
        url,
      });
    }
  }, [isActive, url, document.tittel, setShownDocument]);

  if (editMode) {
    return <SetFilename document={document} onDone={() => setEditMode(false)} />;
  }

  const onClick = () =>
    setShownDocument({
      title: document.tittel,
      url,
    });

  return (
    <StyledDocumentButton
      isActive={isActive}
      onClick={onClick}
      data-testid="oppgavebehandling-documents-open-document-button"
    >
      {document.tittel}
    </StyledDocumentButton>
  );
};

const getURL = (oppgaveId: string, { id }: IMainDocument) =>
  `${DOMAIN}${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/${id}/pdf`;
