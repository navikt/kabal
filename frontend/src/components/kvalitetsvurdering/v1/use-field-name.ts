import type { IKvalitetsvurderingRadio, IKvalitetsvurderingRadioExtended } from '@app/types/kaka-kvalitetsvurdering/v1';

type Keys = keyof IKvalitetsvurderingRadioExtended | keyof IKvalitetsvurderingRadio;

export const KVALITETSVURDERING_V1_FIELD_NAMES: Record<Keys, string> = {
  klageforberedelsenRadioValg: 'Klageforberedelsen',
  utredningenRadioValg: 'Utredningen',
  vedtaketRadioValg: 'Vedtaket',
  brukAvRaadgivendeLegeRadioValg: 'Bruk av rådgivende lege',
};

export const useKvalitetsvurderingV1FieldName = (field: Keys): string => KVALITETSVURDERING_V1_FIELD_NAMES[field];
