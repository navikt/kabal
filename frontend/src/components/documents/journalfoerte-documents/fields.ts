import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import { isNotNull } from '@/functions/is-not-type-guards';
import type { ArchivedDocumentsColumn } from '@/hooks/settings/use-archived-documents-setting';

type Columns = Record<ArchivedDocumentsColumn, boolean>;

/**
 * The fields of an expanded row, in order.
 * Document rows and vedlegg rows share this so the columns line up, even though vedlegg rows
 * only fill in the fields that are document specific.
 */
export const getExpandedFields = (columns: Columns): Fields[] =>
  [
    Fields.Select,
    Fields.ToggleVedlegg,
    Fields.Title,
    columns.TEMA ? Fields.Tema : null,
    columns.DATO_OPPRETTET ? Fields.DatoOpprettet : null,
    columns.DATO_SORTERING ? Fields.DatoSortering : null,
    columns.AVSENDER_MOTTAKER ? Fields.AvsenderMottaker : null,
    columns.SAKSNUMMER ? Fields.Saksnummer : null,
    columns.MELDEKORT ? Fields.Meldekort : null,
    columns.TYPE ? Fields.Type : null,
    Fields.ToggleMetadata,
    Fields.Action,
  ].filter(isNotNull);

export const COLLAPSED_FIELDS: Fields[] = [Fields.Select, Fields.ToggleVedlegg, Fields.Title, Fields.Action];
