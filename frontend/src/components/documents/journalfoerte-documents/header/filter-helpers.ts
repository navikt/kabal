import { skipToken } from '@reduxjs/toolkit/dist/query';
import { isAfter, isBefore, isValid, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { DateRange } from '@app/hooks/settings/use-setting';
import { IArkivertDocument } from '@app/types/arkiverte-documents';

export const useFilteredDocuments = (
  documents: IArkivertDocument[],
  selectedAvsenderMottakere: string[],
  selectedDateRange: DateRange,
  selectedSaksIds: string[],
  selectedTemaer: string[],
  selectedTypes: string[],
  onlyIncluded: boolean,
  search: string,
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
            .map((d) =>
              onlyIncluded
                ? {
                    ...d,
                    vedlegg: d.vedlegg.filter(({ valgt }) => valgt),
                  }
                : d,
            ),
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
