import { KVALITETSVURDERING_V1_FIELD_NAMES } from '@app/components/kvalitetsvurdering/v1/use-field-name';
import {
  KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES,
  KVALITETSVURDERING_V2_FIELD_NAMES,
} from '@app/components/kvalitetsvurdering/v2/common/use-field-name';
import { SaksTypeEnum } from '@app/types/kodeverk';

export const DEFAULT_FIELD_NAMES = {
  ...KVALITETSVURDERING_V1_FIELD_NAMES,
  ...KVALITETSVURDERING_V2_FIELD_NAMES,
  ...KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES,
  vedtaksdokument: 'Vedtaksdokument',
  utfall: 'Utfall/resultat',
  hjemmel: 'Lovhjemmel',
  dokument: 'Dokumenter',
  underArbeid: 'Under arbeid',
  mottattKlageinstans: 'Mottatt klageinstans',
  mottattVedtaksinstans: 'Mottatt vedtaksinstans',
  kjennelseMottatt: 'Kjennelse mottatt',
  sendtTilTrygderetten: 'Sendt til Trygderetten',
  inngaaendeKanal: 'Inngående kanal',
  avsender: 'Avsender',
  gosysOppgaveInput: 'Oppgaven fra Gosys er ferdigstilt',
};

const ANKE_I_TRYGDERETTEN_FIELD_NAMES = {
  utfall: 'Utfall/resultat fra Trygderetten',
};

const ANKE_FIELD_NAMES = {
  mottattKlageinstans: 'Anke mottatt dato',
};

const OMGJØRINGSKRAV_FIELD_NAMES = {
  mottattKlageinstans: 'Omgjøringskrav mottatt dato',
};

export const FIELD_NAMES = {
  [SaksTypeEnum.KLAGE]: DEFAULT_FIELD_NAMES,
  [SaksTypeEnum.ANKE]: { ...DEFAULT_FIELD_NAMES, ...ANKE_FIELD_NAMES },
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: { ...DEFAULT_FIELD_NAMES, ...ANKE_I_TRYGDERETTEN_FIELD_NAMES },
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: DEFAULT_FIELD_NAMES,
  [SaksTypeEnum.OMGJØRINGSKRAV]: { ...DEFAULT_FIELD_NAMES, ...OMGJØRINGSKRAV_FIELD_NAMES },
};

export type Field = keyof typeof DEFAULT_FIELD_NAMES;
