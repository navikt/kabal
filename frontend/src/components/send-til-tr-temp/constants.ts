import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import type { IKodeverkSimpleValue } from '@/types/kodeverk';

export const initialFields = {
  sakenGjelder: '',
  ytelseId: '',
  fagsakId: '',
  sakMottattKlageinstans: null,
  sendtTilTrygderetten: null,
  hjemmelIdList: [] as string[],
  gosysOppgaveId: 0,
};

export const RELEVANTE_YTELSER = [
  'Arbeidsavklaringspenger (AAP)',
  'Dagpenger',
  'Tilleggsstønad',
  'Tilleggsstønad arbeidssøkere',
  'Tiltakspenger',
  'Oppfølgingssak - Tiltaksplass',
  'Oppfølgingssak - NAV-loven §14a',
];

export const NONE_LABEL = 'Ingen';

export const NONE_ENTRY: Entry<IKodeverkSimpleValue | null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};
