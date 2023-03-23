import { KVALITETSVURDERING_V1_FIELD_NAMES } from '@app/components/kvalitetsvurdering/v1/use-field-name';
import {
  KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES,
  KVALITETSVURDERING_V2_FIELD_NAMES,
} from '@app/components/kvalitetsvurdering/v2/common/use-field-name';

export const FIELD_NAMES = {
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
};

type Field = keyof typeof FIELD_NAMES;

export const useFieldName = (field: Field): string => FIELD_NAMES[field] ?? field;
