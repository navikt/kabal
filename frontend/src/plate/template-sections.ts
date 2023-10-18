/*
  Why animals?
  
  Short, non-sortable.
  No need for UUIDs.
  Many to choose from.

  https://en.wikipedia.org/wiki/Haiku
*/

export enum TemplateSections {
  TITLE = 'section-esel',
  INTRODUCTION = 'section-rev',
  KONKLUSJON = 'section-elg',
  ANKEINFO = 'section-ape',
  ANFOERSLER = 'section-ulv',
  VURDERINGEN = 'section-mus',
  OPPLYSNINGER = 'section-sau',
  GENERELL_INFO = 'section-sel',
  /**
   * Deprecated
   * Use VEDTAK or BESLUTNING instead.
   *  */
  AVGJOERELSE = 'section-mår',
  VEDTAK = 'section-ilder',
  BESLUTNING = 'section-sei',
  REGELVERK_TITLE = 'section-gnu',
  SAKSKOSTNADER = 'section-gris',
  FREMLEGG = 'section-geit',
  TILSVARSRETT = 'section-hund',
  VEDLEGG = 'section-katt',
  SVAR_FRA_ROL = 'section-emu',
  TILSVARSBREV_TITLE = 'section-mink',
  PAASTAND = 'section-gås',
  ANKEFRIST = 'section-ørn',
}
