import { useShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import { useLazyIsTilknyttetDokument } from '@app/components/documents/journalfoerte-documents/use-tilknyttede-dokumenter';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import type { ArchivedDocumentsSort, DateRange } from '@app/hooks/settings/use-setting';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';
import { isAfter, isBefore, isValid, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { splitQuery } from './../../../smart-editor/gode-formuleringer/split-query';

export interface ScoredArkvertDocumentVedlegg extends IArkivertDocumentVedlegg {
  score: number;
}

export interface ScoredArkivertDocument extends IArkivertDocument {
  score: number;
  sortScore: number;
  vedlegg: ScoredArkvertDocumentVedlegg[];
}

const EMPTY_ARRAY: ScoredArkivertDocument[] = [];

export const useFilteredDocuments = (
  documents: IArkivertDocument[],
  selectedAvsenderMottakere: string[],
  selectedDateRange: DateRange,
  selectedSaksIds: string[],
  selectedTemaer: string[],
  selectedTypes: string[],
  onlyIncluded: boolean,
  search: string,
  sort: ArchivedDocumentsSort,
): ScoredArkivertDocument[] => {
  const [result, setResult] = useState<ScoredArkivertDocument[]>(EMPTY_ARRAY);
  const isTilknyttet = useLazyIsTilknyttetDokument();
  const { value: showVedleggIdList, setValue: setShowVedleggIdList } = useShowVedlegg();

  useEffect(() => {
    const callback = requestIdleCallback(
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
      () => {
        const splitSearch = search.length > 0 ? splitQuery(search) : null;
        const hasSearch = splitSearch !== null;
        const filteredDocuments: ScoredArkivertDocument[] = [];

        for (const document of documents) {
          const {
            journalpostId,
            dokumentInfoId,
            tittel,
            temaId,
            journalposttype,
            avsenderMottaker,
            datoOpprettet,
            sak,
            vedlegg,
          } = document;

          if (
            checkList(selectedTemaer, temaId) &&
            checkList(selectedTypes, journalposttype) &&
            checkListWithNone(selectedAvsenderMottakere, avsenderMottaker?.id ?? avsenderMottaker?.navn ?? 'UNKNOWN') &&
            checkListWithNone(selectedSaksIds, sak?.fagsakId ?? 'UNKNOWN') &&
            checkDateInterval(datoOpprettet, selectedDateRange)
          ) {
            const filteredVedlegg: ScoredArkvertDocumentVedlegg[] = [];
            let highestVedleggScore = 0;

            for (const v of vedlegg) {
              if (onlyIncluded && !isTilknyttet(journalpostId, v.dokumentInfoId)) {
                continue;
              }

              if (!hasSearch) {
                filteredVedlegg.push({ ...v, score: 0 });
                continue;
              }

              const score = fuzzySearch(splitSearch, v.tittel ?? '');

              if (score > highestVedleggScore) {
                highestVedleggScore = score;
              }

              if (score > 0) {
                if (!showVedleggIdList.includes(journalpostId)) {
                  setShowVedleggIdList([...showVedleggIdList, journalpostId]);
                }

                filteredVedlegg.push({ ...v, score });
              }
            }

            if (onlyIncluded && filteredVedlegg.length === 0 && !isTilknyttet(journalpostId, dokumentInfoId)) {
              continue;
            }

            if (hasSearch) {
              const score = hasSearch ? fuzzySearch(splitSearch, (tittel ?? '') + journalpostId) : 0;

              if (score <= 0 && filteredVedlegg.length === 0) {
                continue;
              }

              filteredDocuments.push({
                ...document,
                vedlegg: filteredVedlegg.toSorted((a, b) => b.score - a.score),
                score: score,
                sortScore: Math.max(score, highestVedleggScore),
              });
            } else {
              filteredDocuments.push({ ...document, vedlegg: filteredVedlegg, score: 0, sortScore: 0 });
            }
          }
        }

        if (hasSearch) {
          setResult(
            filteredDocuments.toSorted((a, b) =>
              a.sortScore === b.sortScore ? sortByDate(a, b, sort) : b.sortScore - a.sortScore,
            ),
          );
        } else {
          setResult(filteredDocuments.toSorted((a, b) => sortByDate(a, b, sort)));
        }
      },
      { timeout: 200 },
    );

    return () => cancelIdleCallback(callback);
  }, [
    documents,
    onlyIncluded,
    search,
    selectedAvsenderMottakere,
    selectedDateRange,
    selectedSaksIds,
    selectedTemaer,
    selectedTypes,
    sort,
    sort.order,
    sort.orderBy,
    isTilknyttet,
    setShowVedleggIdList,
    showVedleggIdList,
  ]);

  return result;
};

const checkList = (list: string[], value: string | null): boolean => {
  if (list.length === 0) {
    return true;
  }

  return value === null ? false : list.includes(value);
};

const checkListWithNone = (list: string[], value: string | null): boolean =>
  list.length === 0 ? true : list.includes(value ?? 'NONE');

const checkDateInterval = (dateString: string, dateRange?: DateRange): boolean => {
  if (dateRange === undefined) {
    return true;
  }

  const [from, to] = dateRange;
  const start = from === null ? null : parseISO(from);
  const end = to === null ? null : parseISO(to);

  const validStart = start !== null && isValid(start);
  const validEnd = end !== null && isValid(end);

  if (!(validStart || validEnd)) {
    return true;
  }

  if (validStart && validEnd) {
    return isWithinInterval(parseISO(dateString), { start, end });
  }

  if (validEnd) {
    return isBefore(parseISO(dateString), end);
  }

  if (validStart) {
    return isAfter(parseISO(dateString), start);
  }

  return false;
};

const sortByDate = (a: IArkivertDocument, b: IArkivertDocument, sort: ArchivedDocumentsSort) => {
  if (sort.order === SortOrder.ASC) {
    if (sort.orderBy === ArchivedDocumentsColumn.DATO_OPPRETTET) {
      return a.datoOpprettet.localeCompare(b.datoOpprettet);
    }

    return a.datoSortering.localeCompare(b.datoSortering);
  }

  // Descending
  if (sort.orderBy === ArchivedDocumentsColumn.DATO_OPPRETTET) {
    return b.datoOpprettet.localeCompare(a.datoOpprettet);
  }

  return b.datoSortering.localeCompare(a.datoSortering);
};
