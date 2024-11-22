/*
  Why animals?
  
  Short, non-sortable.
  No need for UUIDs.
  Many to choose from.

  https://en.wikipedia.org/wiki/Haiku
*/

/**
 * Do not reuse `section-elg` until all references in old documents are gone.
 */
export enum TemplateSections {
  TITLE = 'section-esel',
  INTRODUCTION_V1 = 'section-rev',
  INTRODUCTION_V2 = 'section-rev-v2',
  ANKEINFO = 'section-ape',
  ANFOERSLER = 'section-ulv',
  VURDERINGEN = 'section-mus',
  OPPLYSNINGER = 'section-sau',
  GENERELL_INFO = 'section-sel',
  AVGJOERELSE = 'section-mår',
  REGELVERK_TITLE = 'section-gnu',
  SAKSKOSTNADER = 'section-gris',
  FREMLEGG = 'section-geit',
  TILSVARSRETT_V1 = 'section-hund',
  TILSVARSRETT_V2 = 'section-hund-v2',
  VEDLEGG = 'section-katt',
  SVAR_FRA_ROL = 'section-emu',
  TILSVARSBREV_TITLE = 'section-mink',
  SAKSGANG = 'section-ørn',

  INTRODUCTION_TEMP = 'section-rev-temp', // For "migrating" ROL questions
}
