import type { DokumentInfo } from '@/types/arkiverte-documents';

const MELDEKORT_BREVKODE = 'NAV 00-10.02';

export enum MeldekortFilter {
  /** Show meldekort alongside all other documents. */
  INCLUDE = 'INCLUDE',
  /** Hide meldekort. */
  EXCLUDE = 'EXCLUDE',
  /** Show only meldekort. */
  ONLY = 'ONLY',
}

export const DEFAULT_MELDEKORT_FILTER = MeldekortFilter.EXCLUDE;

export const MELDEKORT_FILTER_OPTIONS = Object.values(MeldekortFilter);

export const MELDEKORT_FILTER_LABELS: Record<MeldekortFilter, string> = {
  [MeldekortFilter.INCLUDE]: 'Med meldekort',
  [MeldekortFilter.EXCLUDE]: 'Uten meldekort',
  [MeldekortFilter.ONLY]: 'Kun meldekort',
};

export const isMeldekortFilter = (value: string | undefined): value is MeldekortFilter =>
  MELDEKORT_FILTER_OPTIONS.some((o) => o === value);

type MeldekortCheckFn = (brevkode: DokumentInfo['brevkode']) => boolean;

export const isMeldekort: MeldekortCheckFn = (brevkode) => brevkode === MELDEKORT_BREVKODE;
const isNotMeldekort: MeldekortCheckFn = (brevkode) => brevkode !== MELDEKORT_BREVKODE;

export const MELDEKORT_FILTERS: Record<MeldekortFilter, MeldekortCheckFn> = {
  [MeldekortFilter.INCLUDE]: () => true,
  [MeldekortFilter.EXCLUDE]: isNotMeldekort,
  [MeldekortFilter.ONLY]: isMeldekort,
};
