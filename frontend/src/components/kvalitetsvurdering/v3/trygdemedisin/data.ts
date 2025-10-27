import { MAIN_REASON_LABELS, MainReason } from '@app/components/kvalitetsvurdering/v3/data';

export const HEADER = MAIN_REASON_LABELS[MainReason.Trygdemedisin];

export enum TrygdemedisinBoolean {
  raadgivendeLegeIkkebrukt = 'raadgivendeLegeIkkebrukt',
  raadgivendeLegeMangelfullBrukAvRaadgivendeLege = 'raadgivendeLegeMangelfullBrukAvRaadgivendeLege',
  raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin = 'raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin',
  raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert = 'raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert',
}

const FIELDS = Object.values(TrygdemedisinBoolean);

export const isTrygdemedisinField = (value: string): value is TrygdemedisinBoolean => FIELDS.some((f) => f === value);

export enum TrygdemedisinErrorFields {
  brukAvRaadgivendeLegeGroup = 'brukAvRaadgivendeLegeGroup',
}

const ERROR_FIELDS = Object.values(TrygdemedisinErrorFields);

export const isTrygdemedisinErrorField = (value: string): value is TrygdemedisinErrorFields =>
  ERROR_FIELDS.some((f) => f === value);

export const TRYGDEMEDISIN_LABELS: Record<TrygdemedisinBoolean, string> = {
  [TrygdemedisinBoolean.raadgivendeLegeIkkebrukt]: 'Rådgivende lege er ikke brukt',
  [TrygdemedisinBoolean.raadgivendeLegeMangelfullBrukAvRaadgivendeLege]:
    'Saksbehandlers bruk av rådgivende lege er mangelfull',
  [TrygdemedisinBoolean.raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin]:
    'Rådgivende lege har uttalt seg om tema utover trygdemedisin',
  [TrygdemedisinBoolean.raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert]:
    'Rådgivende lege er brukt, men begrunnelsen fra rådgivende lege er mangelfull eller ikke dokumentert',
};

export const TRYGDEMEDISIN_ERROR_LABELS: Record<TrygdemedisinErrorFields, string> = {
  [TrygdemedisinErrorFields.brukAvRaadgivendeLegeGroup]: HEADER,
};

export const TRYGDEMEDISIN_HELP_TEXTS: Partial<Record<TrygdemedisinBoolean, string>> = {
  [TrygdemedisinBoolean.raadgivendeLegeIkkebrukt]:
    'Du velger denne dersom rådgivende lege ikke er brukt, men burde vært det for å oppnå en riktig utredning eller vurdering av de trygdemedisinske forhold i saken.',
  [TrygdemedisinBoolean.raadgivendeLegeMangelfullBrukAvRaadgivendeLege]:
    'Du velger denne dersom rådgivende lege er brukt, men burde vært brukt på en bedre måte for å oppnå en riktig utredning eller vurdering av de trygdemedisinske forhold i saken.',
  [TrygdemedisinBoolean.raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin]:
    'Du velger denne dersom rådgivende lege har uttalt seg om tema utover trygdemedisin, og dette kan ha påvirket utredningen eller vurderingen av de trygdemedisinske forhold i saken.',
  [TrygdemedisinBoolean.raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert]:
    'Du velger denne dersom rådgivende lege har gitt en uttalelse som ikke er god nok for å oppnå en riktig utredning eller vurdering av de trygdemedisinske forhold i saken. Du velger også denne dersom uttalelsen fra rådgivende lege ikke er journalført. ',
};
