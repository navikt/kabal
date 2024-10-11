import { DocumentList } from '@app/components/documents/journalfoerte-documents/document-list';
import { Header } from '@app/components/documents/journalfoerte-documents/header/header';
import { SelectContextElement } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { commonStyles } from '@app/components/documents/styled-components/container';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { useFilters } from './header/use-filters';
import { JournalfoertHeading } from './heading/heading';

const EMPTY_ARRAY: IArkivertDocument[] = [];
const EMPTY_ID_LIST: string[] = [];

export const JournalfoerteDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetArkiverteDokumenterQuery(oppgaveId ?? skipToken);
  const [listHeight, setListHeight] = useState<number>(0);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const filters = useFilters(documents);
  const { resetFilters, noFiltersActive, totalFilteredDocuments } = filters;

  const allSelectableDocuments = useMemo<IJournalfoertDokumentId[]>(() => {
    const selectable: IJournalfoertDokumentId[] = [];

    for (const doc of totalFilteredDocuments) {
      if (doc.harTilgangTilArkivvariant) {
        selectable.push({ journalpostId: doc.journalpostId, dokumentInfoId: doc.dokumentInfoId });
      }

      for (const vedlegg of doc.vedlegg) {
        if (vedlegg.harTilgangTilArkivvariant) {
          selectable.push({ journalpostId: doc.journalpostId, dokumentInfoId: vedlegg.dokumentInfoId });
        }
      }
    }

    return selectable;
  }, [totalFilteredDocuments]);

  const documentsWithVedleggIdList = useMemo<string[]>(
    () => documents.filter((d) => d.vedlegg.length !== 0 || d.logiskeVedlegg.length !== 0).map((d) => d.journalpostId),
    [documents],
  );

  const [showVedleggIdList, setShowVedleggIdList] = useState<string[]>(EMPTY_ID_LIST);

  useEffect(() => {
    if (showVedleggIdList !== EMPTY_ID_LIST || documentsWithVedleggIdList.length === 0) {
      return;
    }

    setShowVedleggIdList(documentsWithVedleggIdList);
  }, [documentsWithVedleggIdList, setShowVedleggIdList, showVedleggIdList]);

  // IDs of vedlegg with logiske vedlegg.
  const vedleggWithLogiskeVedleggIdList = useMemo<string[]>(
    () =>
      documents.reduce<string[]>((dokumentInfoIdList, d) => {
        for (const vedlegg of d.vedlegg) {
          if (vedlegg.logiskeVedlegg.length !== 0 && !dokumentInfoIdList.includes(vedlegg.dokumentInfoId)) {
            dokumentInfoIdList.push(`${d.journalpostId}-${vedlegg.dokumentInfoId}`);
          }
        }

        return dokumentInfoIdList;
      }, []),
    [documents],
  );

  const [showLogiskeVedleggIdList, setShowLogiskeVedleggIdList] = useState<string[]>(EMPTY_ID_LIST);

  useEffect(() => {
    if (showLogiskeVedleggIdList !== EMPTY_ID_LIST || vedleggWithLogiskeVedleggIdList.length === 0) {
      return;
    }

    setShowLogiskeVedleggIdList(vedleggWithLogiskeVedleggIdList);
  }, [setShowLogiskeVedleggIdList, showLogiskeVedleggIdList, vedleggWithLogiskeVedleggIdList]);

  const showsAnyVedlegg = showVedleggIdList.length !== 0 || showLogiskeVedleggIdList.length !== 0;

  const onToggle = useCallback(() => {
    setShowVedleggIdList(showsAnyVedlegg ? [] : documentsWithVedleggIdList);
    setShowLogiskeVedleggIdList(showsAnyVedlegg ? [] : vedleggWithLogiskeVedleggIdList);
  }, [documentsWithVedleggIdList, showsAnyVedlegg, vedleggWithLogiskeVedleggIdList]);

  return (
    <SelectContextElement documentList={documents}>
      <Container data-testid="oppgavebehandling-documents-all">
        <JournalfoertHeading
          allDocuments={documents}
          totalLengthOfMainDocuments={data?.totaltAntall ?? 0}
          noFiltersActive={noFiltersActive}
          resetFilters={resetFilters}
          filteredDocuments={totalFilteredDocuments}
        />
        <Wrapper>
          <Header
            filters={filters}
            allSelectableDocuments={allSelectableDocuments}
            documentIdList={documentsWithVedleggIdList}
            listHeight={listHeight}
            showsAnyVedlegg={showsAnyVedlegg}
            toggleShowAllVedlegg={onToggle}
          />

          <DocumentList
            documents={totalFilteredDocuments}
            isLoading={isLoading}
            onHeightChange={setListHeight}
            showVedleggIdList={showVedleggIdList}
            setShowVedleggIdList={setShowVedleggIdList}
            showLogiskeVedleggIdList={showLogiskeVedleggIdList}
            setShowLogiskeVedleggIdList={setShowLogiskeVedleggIdList}
          />
        </Wrapper>
      </Container>
    </SelectContextElement>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
`;

const Container = styled.section`
  ${commonStyles}
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;
