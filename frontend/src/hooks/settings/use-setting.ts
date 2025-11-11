import type { IShownDocument } from '@app/components/view-pdf/types';
import {
  type Setting,
  useBooleanSetting,
  useJsonSetting,
  useNumberSetting,
  useOppgavePath,
  useSetting,
} from '@app/hooks/settings/helpers';
import type { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import type { SortOrder } from '@app/types/sort';
import { useMemo } from 'react';

// Oppgavebehandling tabs
export const useDocumentsEnabled = () => useBooleanSetting(useOppgavePath('tabs/documents/enabled'));
export const useSmartEditorEnabled = () => useBooleanSetting(useOppgavePath('tabs/smart-editor/enabled'));
export const useKvalitetsvurderingEnabled = () => useBooleanSetting(useOppgavePath('tabs/kvalitetsvurdering/enabled'));

// Oppgavebehandling documents
export const useDocumentsPdfViewed = () => {
  const {
    value = [],
    setValue,
    remove,
  } = useJsonSetting<IShownDocument[]>(useOppgavePath('tabs/documents/pdf/viewed'));

  const values = (Array.isArray(value) ? value : [value]).filter(
    (d) => d.type !== DocumentTypeEnum.JOURNALFOERT || 'varianter' in d, // Validate that archived documents have variants.
  );

  return { value: values, setValue, remove };
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
export const useDocumentsFilterDatoSortering = () =>
  useDateRangeSetting(useOppgavePath('tabs/documents/filters/dato_sortering'));

export const useDocumentsAvsenderMottaker = () =>
  useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/avsender_mottaker'));

export type ArchivedDocumentsSortColumn =
  | ArchivedDocumentsColumn.DATO_OPPRETTET
  | ArchivedDocumentsColumn.DATO_SORTERING;

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
export const useSmartEditorGodeFormuleringerExpandstate = () =>
  useJsonSetting<GodeFormuleringerExpandState>(useOppgavePath('tabs/smart-editor/gode_formuleringer_expand_state'));
export const useSmartEditorAnnotationsAtOrigin = () => useBooleanSetting('tabs/smart-editor/annotations_at_origin');
export const useSmartEditorExpandedThreads = () => useBooleanSetting('tabs/smart-editor/expanded_threads');
export const useSmartEditorHistoryOpen = () => useBooleanSetting(useOppgavePath('tabs/smart-editor/history_open'));
export const CAPITALISE_SETTING_KEY = 'tabs/smart-editor/capitalise';
export const useSmartEditorCapitalise = () => useBooleanSetting(CAPITALISE_SETTING_KEY);

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
  ROL_LEDIGE = 'oppgaver/rol_ledige/rows_per_page',
  ROL_UFERDIGE = 'oppgaver/rol_uferdige/rows_per_page',
  ROL_VENTENDE = 'oppgaver/rol_ventende/rows_per_page',
  ROL_RETURNERTE = 'oppgaver/rol_returnerte/rows_per_page',
  ROL_FERDIGE = 'oppgaver/rol_ferdige/rows_per_page',
  SEARCH_ACTIVE = 'oppgaver/search_active/rows_per_page',
  SEARCH_FERDIGE = 'oppgaver/search_ferdige/rows_per_page',
  SEARCH_FEILREGISTRERTE = 'oppgaver/search_feilregistrerte/rows_per_page',
  SEARCH_VENTENDE = 'oppgaver/search_ventende/rows_per_page',
  RELEVANT_ACTIVE = 'oppgaver/relevant_active/rows_per_page',
  RELEVANT_VENTENDE = 'oppgaver/relevant_ventende/rows_per_page',
}

export const useGosysBeskrivelseTab = () => useSetting('oppgavebehandling/gosys/beskrivelse/tab');
export const useForlengetFristPdfWidth = () => useNumberSetting('oppgavebehandling/forlenget_frist/pdf/width');

export enum GodeFormuleringerExpandState {
  COLLAPSED = 'COLLAPSED',
  PREVIEW = 'PREVIEW',
  FULL_RICH_TEXT = 'FULL_RICH_TEXT',
}

/**
 * Enum for PDF scale modes.
 * All:     zoom=137
 * Firefox: zoom=page-width|page-height|page-fit|page-actual|auto
 * Chrome:  view=fitH|fitV|fitB|fitBH|fitBV|fit
 * @external
 * @see https://github.com/chromium/chromium/blob/main/chrome/browser/resources/pdf/open_pdf_params_parser.ts#L21
 */
export enum PdfScaleMode {
  PAGE_FIT = 'page-fit',
  PAGE_WIDTH = 'page-width',
  PAGE_HEIGHT = 'page-height',
  CUSTOM = 'custom',
  NONE = 'none',
}

export const useNewTabPdfScaleMode = () => useJsonSetting<PdfScaleMode>('pdf/new_tab/scale_mode');
export const useNewTabPdfCustomScale = () => useNumberSetting('pdf/new_tab/custom_scale');

export const useHasSeenKeyboardShortcuts = () => useBooleanSetting('has_seen_keyboard_shortcuts');

export enum NotificationsGrouping {
  TYPE = 'TYPE',
  BEHANDLING = 'BEHANDLING',
}

export const useNotificationsOverviewGrouping = () =>
  useJsonSetting<NotificationsGrouping>('notifications/overview/grouping');
