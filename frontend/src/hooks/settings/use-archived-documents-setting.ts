import { useEffect, useMemo } from 'react';
import { type SettingSetter, useBooleanSetting, useJsonSetting } from '@/hooks/settings/helpers';

export enum ArchivedDocumentsColumn {
  TEMA = 'TEMA',
  DATO_OPPRETTET = 'DATO_OPPRETTET',
  DATO_SORTERING = 'DATO_SORTERING',
  AVSENDER_MOTTAKER = 'AVSENDER_MOTTAKER',
  SAKSNUMMER = 'SAKSNUMMER',
  MELDEKORT = 'MELDEKORT',
  TYPE = 'TYPE',
}

export const ARCHIVED_DOCUMENTS_COLUMN_OPTIONS_LABELS: Record<ArchivedDocumentsColumn, string> = {
  [ArchivedDocumentsColumn.TEMA]: 'Tema',
  [ArchivedDocumentsColumn.DATO_OPPRETTET]: 'Dato opprettet',
  [ArchivedDocumentsColumn.DATO_SORTERING]: 'Dato registrert/sendt',
  [ArchivedDocumentsColumn.AVSENDER_MOTTAKER]: 'Avsender/mottaker',
  [ArchivedDocumentsColumn.SAKSNUMMER]: 'Saksnummer',
  [ArchivedDocumentsColumn.MELDEKORT]: 'Meldekort',
  [ArchivedDocumentsColumn.TYPE]: 'Type',
};

export const ARCHIVED_DOCUMENTS_COLUMN_OPTIONS = Object.values(ArchivedDocumentsColumn);

const DEFAULT_ARCHIVED_DOCUMENTS_COLUMNS: ArchivedDocumentsColumn[] = [
  ArchivedDocumentsColumn.TEMA,
  ArchivedDocumentsColumn.DATO_SORTERING,
  ArchivedDocumentsColumn.AVSENDER_MOTTAKER,
  ArchivedDocumentsColumn.SAKSNUMMER,
  ArchivedDocumentsColumn.MELDEKORT,
  ArchivedDocumentsColumn.TYPE,
];

export const useArchivedDocumentsColumns = () => {
  const { value = DEFAULT_ARCHIVED_DOCUMENTS_COLUMNS, ...rest } =
    useJsonSetting<ArchivedDocumentsColumn[]>('tabs/documents/columns');

  useMeldekortMigration(value, rest.setValue);

  const columns: Record<ArchivedDocumentsColumn, boolean> = useMemo(
    () => ({
      [ArchivedDocumentsColumn.TEMA]: value.includes(ArchivedDocumentsColumn.TEMA),
      [ArchivedDocumentsColumn.DATO_OPPRETTET]: value.includes(ArchivedDocumentsColumn.DATO_OPPRETTET),
      [ArchivedDocumentsColumn.DATO_SORTERING]: value.includes(ArchivedDocumentsColumn.DATO_SORTERING),
      [ArchivedDocumentsColumn.AVSENDER_MOTTAKER]: value.includes(ArchivedDocumentsColumn.AVSENDER_MOTTAKER),
      [ArchivedDocumentsColumn.SAKSNUMMER]: value.includes(ArchivedDocumentsColumn.SAKSNUMMER),
      [ArchivedDocumentsColumn.MELDEKORT]: value.includes(ArchivedDocumentsColumn.MELDEKORT),
      [ArchivedDocumentsColumn.TYPE]: value.includes(ArchivedDocumentsColumn.TYPE),
    }),
    [value],
  );

  return { ...rest, value, columns };
};

/**
 * Meldekort column migration.
 * Adds the meldekort column to selected columns, if any.
 * If no columns are selected, default columns are used and no migration is applied.
 * Default columns contain the meldekort column.
 */
const useMeldekortMigration = (
  columns: ArchivedDocumentsColumn[],
  setColumns: SettingSetter<ArchivedDocumentsColumn[]>,
) => {
  const { value: meldekortMigrated = false, setValue: setMeldekortMigrated } = useBooleanSetting(
    'tabs/documents/columns/meldekort-migration',
  );

  useEffect(() => {
    if (meldekortMigrated) console.info('Meldekort column migration already applied. Skipping migration.');
    else if (columns === DEFAULT_ARCHIVED_DOCUMENTS_COLUMNS) {
      console.info('Columns are default. Marking meldekort column migration as applied.');
      setMeldekortMigrated(true);
    } else if (columns.includes(ArchivedDocumentsColumn.MELDEKORT)) {
      console.info('MELDEKORT column already present. Marking meldekort column migration as applied.');
      setMeldekortMigrated(true);
    } else {
      setColumns((v = []) =>
        v.includes(ArchivedDocumentsColumn.MELDEKORT) ? v : [...v, ArchivedDocumentsColumn.MELDEKORT],
      );
      setMeldekortMigrated(true);
      console.info('Meldekort column migration applied. Added MELDEKORT column to archived documents columns.');
    }
  }, [meldekortMigrated, setMeldekortMigrated, columns, setColumns]);
};
