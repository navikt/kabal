import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import type { ArchivedDocumentsSort, DateRange } from '@app/hooks/settings/use-setting';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';
import { isAfter, isBefore, isValid, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { splitQuery } from './../../../smart-editor/gode-formuleringer/split-query';

interface ScoredArkvertDocumentVedlegg extends IArkivertDocumentVedlegg {
  score: number;
}
interface ScoredArkivertDocument extends IArkivertDocument {
  score: number;
  vedlegg: ScoredArkvertDocumentVedlegg[];
}

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
): IArkivertDocument[] => {
  const [result, setResult] = useState<IArkivertDocument[]>(documents);

  useEffect(() => {
    const callback = requestIdleCallback(
      () => {
        const filtered = documents.filter(
          ({ tema, journalposttype, avsenderMottaker, datoOpprettet, sak, vedlegg, valgt }) =>
            (selectedTemaer.length === 0 || (tema !== null && selectedTemaer.includes(tema))) &&
            (selectedTypes.length === 0 || (journalposttype !== null && selectedTypes.includes(journalposttype))) &&
            (selectedAvsenderMottakere.length === 0 ||
              selectedAvsenderMottakere.includes(
                avsenderMottaker === null ? 'NONE' : (avsenderMottaker.id ?? 'UNKNOWN'),
              )) &&
            (selectedSaksIds.length === 0 ||
              selectedSaksIds.includes(sak === null ? 'NONE' : (sak.fagsakId ?? 'UNKNOWN'))) &&
            (selectedDateRange === undefined || checkDateInterval(datoOpprettet, selectedDateRange)) &&
            (onlyIncluded === false || valgt || vedlegg.some((v) => v.valgt)),
        );

        if (search.length === 0) {
          return setResult(
            filtered
              .map((d) => (onlyIncluded ? { ...d, vedlegg: d.vedlegg.filter(({ valgt }) => valgt) } : d))
              .toSorted((a, b) => sortByDate(a, b, sort)),
          );
        }

        const scored: ScoredArkivertDocument[] = [];

        for (const document of filtered) {
          const vedlegg: ScoredArkvertDocumentVedlegg[] = [];
          let highestVedleggScore = 0;
          const journalpostScore = fuzzySearch(splitQuery(search), (document.tittel ?? '') + document.journalpostId);
          const noJournalpostHit = journalpostScore <= 0;

          for (const v of document.vedlegg) {
            const score = fuzzySearch(splitQuery(search), v.tittel ?? '');

            if (noJournalpostHit && score <= 0) {
              continue;
            }

            if (score > highestVedleggScore) {
              highestVedleggScore = score;
            }

            vedlegg.push({ ...v, score });
          }

          const score = Math.max(journalpostScore, highestVedleggScore);

          if (score > 0) {
            scored.push({ ...document, score, vedlegg: vedlegg.toSorted((a, b) => b.score - a.score) });
          }
        }

        setResult(scored.toSorted((a, b) => (a.score === b.score ? sortByDate(a, b, sort) : b.score - a.score)));
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
  ]);

  return result;
};

const checkDateInterval = (dateString: string, [from, to]: DateRange): boolean => {
  const start = from === null ? null : parseISO(from);
  const end = to === null ? null : parseISO(to);

  const validStart = start !== null && isValid(start);
  const validEnd = end !== null && isValid(end);

  if (!validStart && !validEnd) {
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

    if (a.datoRegSendt === null) {
      return b.datoRegSendt === null ? 0 : -1;
    }

    if (b.datoRegSendt === null) {
      return 1;
    }

    return a.datoRegSendt.localeCompare(b.datoRegSendt);
  }

  // Descending
  if (sort.orderBy === ArchivedDocumentsColumn.DATO_OPPRETTET) {
    return b.datoOpprettet.localeCompare(a.datoOpprettet);
  }

  if (b.datoRegSendt === null) {
    return a.datoRegSendt === null ? 0 : -1;
  }

  if (a.datoRegSendt === null) {
    return 1;
  }

  return b.datoRegSendt.localeCompare(a.datoRegSendt);
};
