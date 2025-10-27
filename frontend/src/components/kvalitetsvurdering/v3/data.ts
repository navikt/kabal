export enum MainReason {
  Særregelverket = 'saerregelverk',
  Saksbehandlingsreglene = 'saksbehandlingsregler',
  Trygdemedisin = 'brukAvRaadgivendeLege', // Reuse of field name from v2
}

export const MAIN_REASON_LABELS: Record<MainReason, string> = {
  [MainReason.Særregelverket]: 'Kvalitetsavvik i forvaltningen av særregelverket',
  [MainReason.Saksbehandlingsreglene]: 'Kvalitetsavvik i forvaltningen av saksbehandlingsreglene',
  [MainReason.Trygdemedisin]: 'Kvalitetsavvik i saker med trygdemedisin',
};

export enum AnnetFields {
  annetFritekst = 'annetFritekst',
}
