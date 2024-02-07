import { skipToken } from '@reduxjs/toolkit/query';
import { isAfter, isBefore, isValid, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import { ArchivedDocumentsSort, DateRange } from '@app/hooks/settings/use-setting';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';

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
        const regex = search.length === 0 ? skipToken : stringToRegExp(search);

        return setResult(
          documents
            .filter(
              ({
                tittel,
                journalpostId,
                tema,
                journalposttype,
                avsenderMottaker,
                datoOpprettet,
                sak,
                vedlegg,
                valgt,
              }) =>
                (selectedTemaer.length === 0 || (tema !== null && selectedTemaer.includes(tema))) &&
                (selectedTypes.length === 0 || (journalposttype !== null && selectedTypes.includes(journalposttype))) &&
                (selectedAvsenderMottakere.length === 0 ||
                  selectedAvsenderMottakere.includes(
                    avsenderMottaker === null ? 'NONE' : avsenderMottaker.id ?? 'UNKNOWN',
                  )) &&
                (selectedSaksIds.length === 0 ||
                  selectedSaksIds.includes(sak === null ? 'NONE' : sak.fagsakId ?? 'UNKNOWN')) &&
                (selectedDateRange === undefined || checkDateInterval(datoOpprettet, selectedDateRange)) &&
                (onlyIncluded === false || valgt) &&
                (regex === skipToken || filterDocumentsBySearch(regex, { tittel, journalpostId, vedlegg })),
            )
            .map((d) => (onlyIncluded ? { ...d, vedlegg: d.vedlegg.filter(({ valgt }) => valgt) } : d))
            .toSorted((a, b) => sortByDate(a, b, sort)),
        );
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

interface FilterDocument {
  tittel: string | null;
  journalpostId: string;
  vedlegg: { tittel: string | null }[];
}

const filterDocumentsBySearch = (regex: RegExp, { tittel, journalpostId, vedlegg }: FilterDocument) => {
  const vedleggTitler = vedlegg.map((v) => v.tittel).join(' ');
  const searchIn = [tittel, journalpostId, vedleggTitler].filter(isNotNull).join(' ');

  return regex.test(searchIn);
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
