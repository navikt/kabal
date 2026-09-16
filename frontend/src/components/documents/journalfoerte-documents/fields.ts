import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import { isNotNull } from '@/functions/is-not-type-guards';
import type { ArchivedDocumentsColumn } from '@/hooks/settings/use-archived-documents-setting';

export type Columns = Record<ArchivedDocumentsColumn, boolean>;

export const getExpandedDocumentFields = (columns: Columns): Fields[] =>
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

export const COLLAPSED_DOCUMENT_FIELDS: Fields[] = [Fields.Select, Fields.ToggleVedlegg, Fields.Title, Fields.Action];

export const getExpandedVedleggFields = (columns: Columns): Fields[] =>
  [
    Fields.Select,
    Fields.ToggleVedlegg,
    Fields.Title,
    columns.MELDEKORT ? Fields.Meldekort : null,
    Fields.Action,
  ].filter(isNotNull);

export const COLLAPSED_VEDLEGG_FIELDS = [Fields.Select, Fields.ToggleVedlegg, Fields.Title, Fields.Action];
