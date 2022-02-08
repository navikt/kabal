import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useMemo } from 'react';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useGetTilknyttedeDokumenterQuery } from '../../../../redux-api/oppgavebehandling';
import { IDocumentReference } from '../../../../types/oppgave-common';
import { dokumentMatcher } from '../../helpers';
import { Loading } from '../../loading';
import { ITilknyttetDokument } from '../../types';
import { ListContainer, StyledSubHeader } from '../styled-components/container';
import { DocumentList } from '../styled-components/document-list';
import { AttachedDocument } from './document';

const EMPTY_DOCUMENT_LIST: IDocumentReference[] = [];

export const AttachedDocumentList = () => {
  const { data } = useOppgave();

  const tilknyttedeDokumenter: IDocumentReference[] = data?.tilknyttedeDokumenter ?? EMPTY_DOCUMENT_LIST;

  const {
    data: lagredeTilknyttedeDokumenter,
    isLoading,
    isFetching,
  } = useGetTilknyttedeDokumenterQuery(data?.id ?? skipToken);

  const documents = useMemo<ITilknyttetDokument[]>(() => {
    if (typeof lagredeTilknyttedeDokumenter === 'undefined') {
      return [];
    }

    return lagredeTilknyttedeDokumenter.dokumenter
      .map((document) => ({
        document,
        tilknyttet: tilknyttedeDokumenter.some((t) => dokumentMatcher(t, document)),
      }))
      .filter(({ document, tilknyttet }) => tilknyttet || document.vedlegg.length !== 0);
  }, [tilknyttedeDokumenter, lagredeTilknyttedeDokumenter]);

  return (
    <ListContainer data-testid="oppgavebehandling-documents-tilknyttede">
      <Loading loading={isLoading || isFetching} />
      <StyledSubHeader>Journalførte dokumenter</StyledSubHeader>
      <DocumentList data-testid="oppgavebehandling-documents-tilknyttede-list">
        {documents.map(({ document, tilknyttet }) => (
          <AttachedDocument
            key={document.journalpostId + document.dokumentInfoId}
            dokument={document}
            tilknyttet={tilknyttet}
            tilknyttedeDokumenter={tilknyttedeDokumenter}
          />
        ))}
      </DocumentList>
    </ListContainer>
  );
};
