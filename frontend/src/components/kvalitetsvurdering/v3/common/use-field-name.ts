import { LABEL } from '@app/components/kvalitetsvurdering/v3/annet/data';
import { AnnetFields, MAIN_REASON_LABELS } from '@app/components/kvalitetsvurdering/v3/data';
import {
  SAKSBEHANDLINGSREGLENE_ERROR_LABELS,
  SAKSBEHANDLINGSREGLENE_LABELS,
} from '@app/components/kvalitetsvurdering/v3/saksbehandlingsreglene/data';
import {
  SÆRREGELVERKET_ERROR_LABELS,
  SÆRREGELVERKET_LABELS,
} from '@app/components/kvalitetsvurdering/v3/særregelverket/data';
import {
  TRYGDEMEDISIN_ERROR_LABELS,
  TRYGDEMEDISIN_LABELS,
} from '@app/components/kvalitetsvurdering/v3/trygdemedisin/data';
import type { KvalitetsvurderingDataV3 } from '@app/types/kaka-kvalitetsvurdering/v3';

type Keys = keyof KvalitetsvurderingDataV3;

export const KVALITETSVURDERING_V3_FIELD_NAMES: Record<Keys, string> = {
  ...MAIN_REASON_LABELS,
  ...SÆRREGELVERKET_LABELS,
  ...SAKSBEHANDLINGSREGLENE_LABELS,
  ...TRYGDEMEDISIN_LABELS,

  [AnnetFields.annetFritekst]: LABEL,
};

export const KVALITETSVURDERING_V3_CHECKBOX_GROUP_NAMES = {
  ...SÆRREGELVERKET_ERROR_LABELS,
  ...SAKSBEHANDLINGSREGLENE_ERROR_LABELS,
  ...TRYGDEMEDISIN_ERROR_LABELS,
};

export const useKvalitetsvurderingV3FieldName = (field: Keys): string => KVALITETSVURDERING_V3_FIELD_NAMES[field];
