import { isWithinInterval, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { IOption } from '../../../filter-dropdown/props';

export const getAvsenderMottakerOptions = (documents: IArkivertDocument[]): IOption<string>[] =>
  documents.reduce<IOption<string>[]>((acc, { avsenderMottaker }) => {
    if (avsenderMottaker === null) {
      if (acc.every((am) => am.value !== 'NONE')) {
        acc.push({ label: 'Ingen', value: 'NONE' });
      }

      return acc;
    }

    const { navn, id } = avsenderMottaker;

    const label = navn ?? id ?? 'Ukjent';
    const value = id ?? 'UNKNOWN';

    if (acc.some((am) => am.value === value)) {
      return acc;
    }

    acc.push({ label, value });

    return acc;
  }, []);

export const getSaksIdOptions = (documents: IArkivertDocument[]): IOption<string>[] =>
  documents.reduce<IOption<string>[]>((acc, { sak }) => {
    if (sak === null) {
      if (acc.every((am) => am.value !== 'NONE')) {
        acc.push({ label: 'Ingen', value: 'NONE' });
      }

      return acc;
    }

    const { fagsakId } = sak;

    const label = fagsakId ?? 'Ukjent';
    const value = fagsakId ?? 'UNKNOWN';

    if (acc.some((am) => am.value === value)) {
      return acc;
    }

    acc.push({ label, value });

    return acc;
  }, []);

export const filterDocuments = (
  documents: IArkivertDocument[],
  selectedAvsenderMottakere: string[],
  selectedDateRange: DateRange | undefined,
  selectedSaksIds: string[],
  selectedTemaer: string[],
  selectedTypes: string[]
) =>
  documents.filter(
    ({ tema, journalposttype, avsenderMottaker, registrert, sak }) =>
      (selectedTemaer.length === 0 || (tema !== null && selectedTemaer.includes(tema))) &&
      (selectedTypes.length === 0 || (journalposttype !== null && selectedTypes.includes(journalposttype))) &&
      (selectedAvsenderMottakere.length === 0 ||
        selectedAvsenderMottakere.includes(avsenderMottaker === null ? 'NONE' : avsenderMottaker.id ?? 'UNKNOWN')) &&
      (selectedSaksIds.length === 0 || selectedSaksIds.includes(sak === null ? 'NONE' : sak.fagsakId ?? 'UNKNOWN')) &&
      (selectedDateRange === undefined || checkDateInterval(registrert, selectedDateRange))
  );

const checkDateInterval = (date: string, { from, to }: DateRange) => {
  if (from !== undefined && to !== undefined) {
    return isWithinInterval(parseISO(date), { start: from, end: to });
  }

  return true;
};
