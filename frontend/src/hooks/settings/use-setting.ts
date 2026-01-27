import type { IFilesViewed } from '@app/components/file-viewer/types';
import { parseJSON } from '@app/functions/parse-json';
import {
  getOppgavePath,
  getSettingKey,
  type Setting,
  useBooleanSetting,
  useJsonSetting,
  useNumberSetting,
  useOppgavePath,
  useSetting,
} from '@app/hooks/settings/helpers';
import { SETTINGS_MANAGER } from '@app/hooks/settings/manager';
import type { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import { Journalposttype } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import type { SortOrder } from '@app/types/sort';
import { useCallback, useMemo } from 'react';

// Oppgavebehandling tabs
export const useDocumentsEnabled = () => useBooleanSetting(useOppgavePath('tabs/documents/enabled'));
export const useSmartEditorEnabled = () => useBooleanSetting(useOppgavePath('tabs/smart-editor/enabled'));
export const useKvalitetsvurderingEnabled = () => useBooleanSetting(useOppgavePath('tabs/kvalitetsvurdering/enabled'));

const FILES_VIEWED_SETTING_SUFFIX = 'tabs/documents/file-viewer/files';

export const DEFAULT_FILES_VIEWED: IFilesViewed = { archivedFiles: [] };

// Oppgavebehandling documents
export const useFilesViewed = () => {
  const {
    value = DEFAULT_FILES_VIEWED,
    setValue,
    remove,
  } = useJsonSetting<IFilesViewed>(useOppgavePath(FILES_VIEWED_SETTING_SUFFIX));

  const setNewDocument = useCallback((documentId: string) => setValue({ newDocument: documentId }), [setValue]);

  const setArchivedFiles = useCallback(
    (files: readonly IJournalfoertDokumentId[]) => setValue({ archivedFiles: [...files] }),
    [setValue],
  );

  const setVedleggsoversikt = useCallback(
    (documentId: string) => setValue({ vedleggsoversikt: documentId }),
    [setValue],
  );

  return { value, setValue, setNewDocument, setArchivedFiles, setVedleggsoversikt, remove };
};

export const getFilesViewed = (oppgaveId: string, navIdent: string): IFilesViewed => {
  const key = getOppgavePath(oppgaveId, FILES_VIEWED_SETTING_SUFFIX);
  const setting = getSettingKey(navIdent, key);
  const raw = SETTINGS_MANAGER.get(setting);

  if (raw === undefined) {
    return DEFAULT_FILES_VIEWED;
  }

  return parseJSON<IFilesViewed>(raw) ?? DEFAULT_FILES_VIEWED;
};

export const setFilesViewed = (oppgaveId: string, navIdent: string, documents: IFilesViewed) => {
  const key = getOppgavePath(oppgaveId, FILES_VIEWED_SETTING_SUFFIX);
  const setting = getSettingKey(navIdent, key);
  SETTINGS_MANAGER.set(setting, JSON.stringify(documents));
};

export const useFileViewerWidth = () => useNumberSetting(useOppgavePath('tabs/documents/file-viewer/width'));
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

export const useHasSeenKeyboardShortcuts = () => useBooleanSetting('has_seen_keyboard_shortcuts');

export enum NotificationsGrouping {
  TYPE = 'TYPE',
  BEHANDLING = 'BEHANDLING',
}

export const useNotificationsOverviewGrouping = () =>
  useJsonSetting<NotificationsGrouping>('notifications/overview/grouping');

export const usePdfRotation = (url: string, pageNumber: number) => {
  const encoded = new TextEncoder().encode(url).toBase64();

  return useJsonSetting<0 | 90 | 180 | 270>(`pdf/${encoded}/page/${pageNumber.toString(10)}/rotation`);
};
