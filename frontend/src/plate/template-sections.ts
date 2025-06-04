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
  TILSVARSRETT_V3 = 'section-hund-v3',
  VEDLEGG = 'section-katt',
  SVAR_FRA_ROL = 'section-emu',
  TILSVARSBREV_TITLE = 'section-mink',
  SAKSGANG = 'section-ørn',
  SVAR_PÅ_INNSYNSBEGJÆRING = 'section-orm',
  OM_TAUSHETSPLIKT = 'section-due',
  HVORFOR_OMGJØRING = 'section-ara',
  OM_REGELVERK = 'section-and',
  OM_ANKENDE_PARTS_TILSVAR = 'section-sei',
  OM_VEDLAGTE_DOKUMENTER = 'section-uer',
  OM_ETTERSENDING_TIL_TR = 'section-hai',

  INTRODUCTION_TEMP = 'section-rev-temp', // For "migrating" ROL questions
}

/**
 * Template sections that should not be used in new documents.
 * They only exist for filtering existing sections and texts.
 */
export enum DeprecatedTemplateSections {
  INTRODUCTION_V1 = 'section-rev',

  TILSVARSRETT_V1 = 'section-hund',
  TILSVARSRETT_V2 = 'section-hund-v2',
}
