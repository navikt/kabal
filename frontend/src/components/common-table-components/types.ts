export enum ColumnKeyEnum {
  Type = 0,
  TypeWithAnkeITrygderetten = 1,
  Ytelse = 2,
  RolYtelse = 3,
  Innsendingshjemler = 4,
  RolInnsendingshjemler = 5,
  EnhetInnsendingshjemler = 6,
  Registreringshjemler = 7,
  Navn = 8,
  Fnr = 9,
  Age = 10,
  Deadline = 11,
  VarsletFrist = 12,
  Medunderskriver = 13,
  Rol = 14,
  FlowStates = 15,
  Open = 16,
  OpenWithYtelseAccess = 17,
  TildelingWithFilter = 18,
  Tildeling = 19,
  Oppgavestyring = 20,
  OppgavestyringNonFilterable = 21,
  Utfall = 22,
  PaaVentTil = 23,
  PaaVentReason = 24,
  Finished = 25,
  Returnert = 26,
  Feilregistrert = 27,
  Saksnummer = 28,
  RolTildeling = 29,
  RelevantOppgaver = 30,
  FradelingReason = 31,
  PreviousSaksbehandler = 32,
  DatoSendtTilTr = 33,
}

export const TABLE_HEADERS = {
  [ColumnKeyEnum.Type]: 'Type',
  [ColumnKeyEnum.TypeWithAnkeITrygderetten]: 'Type',
  [ColumnKeyEnum.Ytelse]: 'Ytelse',
  [ColumnKeyEnum.RolYtelse]: 'Ytelse',
  [ColumnKeyEnum.Innsendingshjemler]: 'Hjemmel',
  [ColumnKeyEnum.RolInnsendingshjemler]: 'Hjemmel',
  [ColumnKeyEnum.EnhetInnsendingshjemler]: 'Hjemmel',
  [ColumnKeyEnum.Registreringshjemler]: 'Registreringshjemler',
  [ColumnKeyEnum.Navn]: 'Navn',
  [ColumnKeyEnum.Fnr]: 'Fnr.',
  [ColumnKeyEnum.Age]: 'Alder',
  [ColumnKeyEnum.Deadline]: 'Frist',
  [ColumnKeyEnum.VarsletFrist]: 'Varslet frist',
  [ColumnKeyEnum.Medunderskriver]: 'Medunderskriver',
  [ColumnKeyEnum.Rol]: 'Rådgivende overlege',
  [ColumnKeyEnum.FlowStates]: null,
  [ColumnKeyEnum.Open]: null,
  [ColumnKeyEnum.OpenWithYtelseAccess]: null,
  [ColumnKeyEnum.Tildeling]: 'Tildeling',
  [ColumnKeyEnum.TildelingWithFilter]: 'Tildeling',
  [ColumnKeyEnum.Oppgavestyring]: 'Tildeling',
  [ColumnKeyEnum.OppgavestyringNonFilterable]: 'Tildeling',
  [ColumnKeyEnum.Utfall]: 'Utfall',
  [ColumnKeyEnum.PaaVentTil]: 'På vent til',
  [ColumnKeyEnum.PaaVentReason]: 'Årsak',
  [ColumnKeyEnum.Finished]: 'Fullført',
  [ColumnKeyEnum.Returnert]: 'Returnert',
  [ColumnKeyEnum.Feilregistrert]: 'Tidspunkt for feilregistrering',
  [ColumnKeyEnum.Saksnummer]: 'Saksnummer',
  [ColumnKeyEnum.RolTildeling]: 'Tildeling',
  [ColumnKeyEnum.RelevantOppgaver]: null,
  [ColumnKeyEnum.FradelingReason]: null,
  [ColumnKeyEnum.PreviousSaksbehandler]: 'Forrige saksbehandler',
  [ColumnKeyEnum.DatoSendtTilTr]: 'Dato sendt til TR',
};
