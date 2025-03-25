import { DocumentList } from '@app/components/documents/journalfoerte-documents/document-list';
import { Header } from '@app/components/documents/journalfoerte-documents/header/header';
import { KeyboardContextElement } from '@app/components/documents/journalfoerte-documents/keyboard-context';
import { SelectContextElement } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
    () => documents.filter((d) => d.vedlegg.length > 0 || d.logiskeVedlegg.length > 0).map((d) => d.journalpostId),
    [documents],
  );

  const [showVedleggIdList, setShowVedleggIdList] = useState<string[]>(EMPTY_ID_LIST);

  useEffect(() => {
    if (showVedleggIdList !== EMPTY_ID_LIST || documentsWithVedleggIdList.length === 0) {
      return;
    }

    setShowVedleggIdList(documentsWithVedleggIdList);
  }, [documentsWithVedleggIdList, showVedleggIdList]);

  const [showMetadataIdList, setShowMetadataIdList] = useState<string[]>([]);

  // IDs of vedlegg with logiske vedlegg.
  const vedleggWithLogiskeVedleggIdList = useMemo<string[]>(
    () =>
      documents.reduce<string[]>((dokumentInfoIdList, d) => {
        for (const vedlegg of d.vedlegg) {
          if (vedlegg.logiskeVedlegg.length > 0 && !dokumentInfoIdList.includes(vedlegg.dokumentInfoId)) {
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
  }, [showLogiskeVedleggIdList, vedleggWithLogiskeVedleggIdList]);

  const showsAnyVedlegg = showVedleggIdList.length > 0 || showLogiskeVedleggIdList.length > 0;

  const onToggle = useCallback(() => {
    setShowVedleggIdList(showsAnyVedlegg ? [] : documentsWithVedleggIdList);
    setShowLogiskeVedleggIdList(showsAnyVedlegg ? [] : vedleggWithLogiskeVedleggIdList);
  }, [documentsWithVedleggIdList, showsAnyVedlegg, vedleggWithLogiskeVedleggIdList]);

  return (
    <SelectContextElement documentList={documents}>
      <KeyboardContextElement
        documents={documents}
        showVedleggIdList={showVedleggIdList}
        setShowVedleggIdList={setShowVedleggIdList}
        setShowMetadataIdList={setShowMetadataIdList}
      >
        <VStack
          as="section"
          paddingInline="4"
          paddingBlock="0 2"
          flexGrow="1"
          justify="space-between"
          overflow="hidden"
          data-testid="oppgavebehandling-documents-all"
        >
          <JournalfoertHeading
            allDocuments={documents}
            totalLengthOfMainDocuments={data?.totaltAntall ?? 0}
            noFiltersActive={noFiltersActive}
            resetFilters={resetFilters}
            filteredDocuments={totalFilteredDocuments}
          />
          <VStack overflow="hidden" flexGrow="1">
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
              showMetadataIdList={showMetadataIdList}
              setShowMetadataIdList={setShowMetadataIdList}
            />
          </VStack>
        </VStack>
      </KeyboardContextElement>
    </SelectContextElement>
  );
};
