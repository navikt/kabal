export enum MainReason {
  Særregelverket = 'saerregelverk',
  Saksbehandlingsreglene = 'saksbehandlingsregler',
  Trygdemedisin = 'brukAvRaadgivendeLege', // Reuse of field name from v2
}

// export const MAIN_REASONS = Object.values(MainReason);

// export const isMainReason = (value: string): value is MainReason => MAIN_REASONS.some((v) => v === value);

export const MAIN_REASON_LABELS: Record<MainReason, string> = {
  [MainReason.Særregelverket]: 'Kvalitetsavvik i forvaltningen av særregelverket',
  [MainReason.Saksbehandlingsreglene]: 'Kvalitetsavvik i forvaltningen av saksbehandlingsreglene',
  [MainReason.Trygdemedisin]: 'Kvalitetsavvik i saker med trygdemedisin',
};

// export const MAIN_REASON_HELPTEXTS: Record<MainReason, string | null> = {
//   [MainReason.Særregelverket]: null,
//   [MainReason.Saksbehandlingsreglene]: null,
//   [MainReason.Trygdemedisin]: null,
// };

export enum AnnetFields {
  annetFritekst = 'annetFritekst',
}
