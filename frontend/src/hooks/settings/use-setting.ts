import { useMemo } from 'react';
import { IShownDocument } from '@app/components/view-pdf/types';
import {
  Setting,
  useBooleanSetting,
  useJsonSetting,
  useNumberSetting,
  useOppgavePath,
  useSetting,
} from '@app/hooks/settings/helpers';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { SortOrder } from '@app/types/sort';

// Oppgavebehandling tabs
export const useDocumentsEnabled = () => useBooleanSetting(useOppgavePath('tabs/documents/enabled'));
export const useSmartEditorEnabled = () => useBooleanSetting(useOppgavePath('tabs/smart-editor/enabled'));
export const useKvalitetsvurderingEnabled = () => useBooleanSetting(useOppgavePath('tabs/kvalitetsvurdering/enabled'));

// Oppgavebehandling documents
export const useDocumentsPdfViewed = () => {
  const { value = [], ...rest } = useJsonSetting<IShownDocument[]>(useOppgavePath('tabs/documents/pdf/viewed'));

  const values = Array.isArray(value) ? value : [value];

  return { value: values, ...rest };
};
export const useDocumentsPdfWidth = () => useNumberSetting(useOppgavePath('tabs/documents/pdf/width'));
export const useDocumentsArchivePdfWidth = () => useNumberSetting(useOppgavePath('tabs/documents/modal/pdf/width'));
export const useDocumentsExpanded = () => useBooleanSetting(useOppgavePath('tabs/documents/expanded'));
export const useDocumentsWidth = () => useNumberSetting(useOppgavePath('tabs/documents/width'));

// Oppgavebehandling documents filters
export const useDocumentsFilterTema = () => useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/tema'));

export type DateRange = [string | null, string | null];
const EMPTY_DATE_RANGE: [null, null] = [null, null];
export type DateRangeSetting = Setting<DateRange, DateRange>;

const useDateRangeSetting = (property: string): DateRangeSetting => {
  const { value = EMPTY_DATE_RANGE, ...rest } = useJsonSetting<DateRange>(property);

  return { ...rest, value };
};

export const useDocumentsFilterDatoOpprettet = () => useDateRangeSetting(useOppgavePath('tabs/documents/filters/dato'));
export const useDocumentsFilterDatoRegSendt = () =>
  useDateRangeSetting(useOppgavePath('tabs/documents/filters/dato_reg_sendt'));

export const useDocumentsAvsenderMottaker = () =>
  useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/avsender_mottaker'));

export type ArchivedDocumentsSortColumn =
  | ArchivedDocumentsColumn.DATO_OPPRETTET
  | ArchivedDocumentsColumn.DATO_REG_SENDT;

export interface ArchivedDocumentsSort {
  order: SortOrder;
  orderBy: ArchivedDocumentsSortColumn;
}

export const useDocumentsSort = () => useJsonSetting<ArchivedDocumentsSort>(useOppgavePath('tabs/documents/sort'));

const JOURNALPOSTTYPE_LIST = Object.values(Journalposttype);

export const useDocumentsFilterType = () => {
  const { value: v, ...rest } = useJsonSetting<Journalposttype[]>(useOppgavePath('tabs/documents/filters/type'));

  const value = useMemo(() => (Array.isArray(v) ? v.filter((t) => JOURNALPOSTTYPE_LIST.includes(t)) : undefined), [v]);

  return { ...rest, value };
};

export const useDocumentsFilterSaksId = () => useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/saksid'));

export const useDocumentsOnlyIncluded = () => useBooleanSetting(useOppgavePath('tabs/documents/filters/included'));
// Oppgavebehandling smart editor
export const useSmartEditorActiveDocument = () => useSetting(useOppgavePath('tabs/smart-editor/active_document'));
export const useSmartEditorGodeFormuleringerOpen = () =>
  useBooleanSetting(useOppgavePath('tabs/smart-editor/gode_formuleringer_open'));
export const useSmartEditorAnnotationsAtOrigin = () =>
  useBooleanSetting(useOppgavePath('tabs/smart-editor/annotations_at_origin'));
export const useSmartEditorHistoryOpen = () => useBooleanSetting(useOppgavePath('tabs/smart-editor/history_open'));

export enum ScalingGroup {
  OPPGAVEBEHANDLING = 'oppgavebehandling',
  REDAKTØR = 'redaktør',
}

export const useSmartEditorScale = (prefix: ScalingGroup) => useNumberSetting(`${prefix}/smart-editor/zoom`);

export enum OppgaveTableRowsPerPage {
  LEDIGE = 'oppgaver/ledige/rows_per_page',
  MINE_UFERDIGE = 'oppgaver/mine_uferdige/rows_per_page',
  MINE_RETURNERTE = 'oppgaver/mine_returnerte/rows_per_page',
  MINE_VENTENDE = 'oppgaver/mine_ventende/rows_per_page',
  ENHETENS_UFERDIGE = 'oppgaver/enhetens_uferdige/rows_per_page',
  ENHETENS_VENTENDE = 'oppgaver/enhetens_ventende/rows_per_page',
  ENHETENS_FERDIGE = 'oppgaver/enhetens_ferdige/rows_per_page',
  ROL_UFERDIGE = 'oppgaver/rol_uferdige/rows_per_page',
  ROL_VENTENDE = 'oppgaver/rol_ventende/rows_per_page',
  ROL_FERDIGE = 'oppgaver/rol_ferdige/rows_per_page',
  SEARCH_ACTIVE = 'oppgaver/search_active/rows_per_page',
  SEARCH_DONE = 'oppgaver/search_done/rows_per_page',
  SEARCH_FEILREGISTRERTE = 'oppgaver/search_feilregistrerte/rows_per_page',
  SEARCH_PAA_VENT = 'oppgaver/search_paa_vent/rows_per_page',
  RELEVANT_ACTIVE = 'oppgaver/relevant_active/rows_per_page',
}

export const useGosysBeskrivelseTab = () => useSetting('oppgavebehandling/gosys/beskrivelse/tab');
