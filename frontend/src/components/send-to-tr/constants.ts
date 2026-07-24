import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import type { AnkeFormFields } from '@/components/send-to-tr/types';

export const INITIAL_FIELDS: AnkeFormFields = {
  fagsakId: '',
  sakMottattKlageinstans: null,
  sendtTilTrygderetten: null,
  hjemmelIdList: [],
  gosysOppgaveId: 0,
};

export const WHITESPACE_REGEX = /\s+/g;

export const RELEVANT_YTELSER = ['9', '16', '40', '34', '44', '56', '33'];

export const NONE_LABEL = 'Ingen';

export const NONE_ENTRY: Entry<null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};

export const FAGSAK_ID = 'fagsakId';
export const SAK_MOTTATT_KLAGEINSTANS_ID = 'sakMottattKlageinstans';
export const SENDT_TIL_TRYGDERETTEN_ID = 'sendtTilTrygderetten';
export const HJEMMEL_LIST_ID = 'hjemmelIdList';
