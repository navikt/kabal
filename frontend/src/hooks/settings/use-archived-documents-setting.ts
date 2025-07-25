import { useMemo } from 'react';
import { useJsonSetting } from './helpers';

export enum ArchivedDocumentsColumn {
  TEMA = 'TEMA',
  DATO_OPPRETTET = 'DATO_OPPRETTET',
  DATO_SORTERING = 'DATO_SORTERING',
  AVSENDER_MOTTAKER = 'AVSENDER_MOTTAKER',
  SAKSNUMMER = 'SAKSNUMMER',
  TYPE = 'TYPE',
}

export const ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS: Record<ArchivedDocumentsColumn, string> = {
  [ArchivedDocumentsColumn.TEMA]: 'Tema',
  [ArchivedDocumentsColumn.DATO_OPPRETTET]: 'Dato opprettet',
  [ArchivedDocumentsColumn.DATO_SORTERING]: 'Dato registrert/sendt',
  [ArchivedDocumentsColumn.AVSENDER_MOTTAKER]: 'Avsender/mottaker',
  [ArchivedDocumentsColumn.SAKSNUMMER]: 'Saksnummer',
  [ArchivedDocumentsColumn.TYPE]: 'Type',
};

export const ARCHIVED_DOCUMENTS_COLUMN_OPTIONS = Object.values(ArchivedDocumentsColumn);

const DEFAULT_ARCHIVED_DOCUMENTS_COLUMNS: ArchivedDocumentsColumn[] = [
  ArchivedDocumentsColumn.TEMA,
  ArchivedDocumentsColumn.DATO_OPPRETTET,
  ArchivedDocumentsColumn.AVSENDER_MOTTAKER,
  ArchivedDocumentsColumn.SAKSNUMMER,
  ArchivedDocumentsColumn.TYPE,
];

export const useArchivedDocumentsColumns = () => {
  const { value = DEFAULT_ARCHIVED_DOCUMENTS_COLUMNS, ...rest } =
    useJsonSetting<ArchivedDocumentsColumn[]>('tabs/documents/columns');

  const columns: Record<ArchivedDocumentsColumn, boolean> = useMemo(
    () => ({
      [ArchivedDocumentsColumn.TEMA]: value.includes(ArchivedDocumentsColumn.TEMA),
      [ArchivedDocumentsColumn.DATO_OPPRETTET]: value.includes(ArchivedDocumentsColumn.DATO_OPPRETTET),
      [ArchivedDocumentsColumn.DATO_SORTERING]: value.includes(ArchivedDocumentsColumn.DATO_SORTERING),
      [ArchivedDocumentsColumn.AVSENDER_MOTTAKER]: value.includes(ArchivedDocumentsColumn.AVSENDER_MOTTAKER),
      [ArchivedDocumentsColumn.SAKSNUMMER]: value.includes(ArchivedDocumentsColumn.SAKSNUMMER),
      [ArchivedDocumentsColumn.TYPE]: value.includes(ArchivedDocumentsColumn.TYPE),
    }),
    [value],
  );

  return { ...rest, value, columns };
};
