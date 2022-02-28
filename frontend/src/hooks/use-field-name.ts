export const FIELD_NAMES = {
  klageforberedelsenRadioValg: 'Klageforberedelsen',
  utredningenRadioValg: 'Utredningen',
  vedtaketRadioValg: 'Vedtaket',
  brukAvRaadgivendeLegeRadioValg: 'Bruk av rådgivende lege',
  vedtaksdokument: 'Vedtaksdokument',
  utfall: 'Utfall/resultat',
  hjemmel: 'Lovhjemmel',
  dokument: 'Dokumenter',
  underArbeid: 'Under arbeid',
};

export const useFieldName = (field: keyof typeof FIELD_NAMES): string => FIELD_NAMES[field] ?? field;
