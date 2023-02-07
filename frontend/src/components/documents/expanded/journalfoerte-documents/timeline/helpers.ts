import { Cancel, Email, FileFolder, FileSuccess, Glasses, Print, SaveFile } from '@navikt/ds-icons';
import { Kanal, RelevantDatotype } from '../../../../../types/arkiverte-documents';

export const DATOTYPE_NAME: Record<RelevantDatotype, string> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: 'Sendt print',
  [RelevantDatotype.DATO_EKSPEDERT]: 'Ekspedert',
  [RelevantDatotype.DATO_JOURNALFOERT]: 'Journalført',
  [RelevantDatotype.DATO_REGISTRERT]: 'Registrert',
  [RelevantDatotype.DATO_AVS_RETUR]: 'Avsender retur',
  [RelevantDatotype.DATO_DOKUMENT]: 'Opprettet',
  [RelevantDatotype.DATO_LEST]: 'Lest',
};

export const KANAL_NAME: Record<Kanal, [string, string] | [string]> = {
  ALTINN: ['Altinn'],
  EIA: ['EIA'],
  NAV_NO: ['nav.no'],
  NAV_NO_UINNLOGGET: ['nav.no (uinnlogget)'],
  NAV_NO_CHAT: ['Innlogget chat'],
  SKAN_NETS: ['Skanning', 'Skanning Nets'],
  SKAN_PEN: ['Skanning', 'Skanning Pensjon'],
  SKAN_IM: ['Skanning', 'Skanning Iron Mountain'],
  INNSENDT_NAV_ANSATT: ['Innsendt av NAV-ansatt'],
  EESSI: ['EESSI'],
  EKST_OPPS: ['Eksternt oppslag'],
  SENTRAL_UTSKRIFT: ['Sentral utskrift'],
  LOKAL_UTSKRIFT: ['Lokal utskrift'],
  SDP: ['SDP', 'Digital postkasse til innbyggere'],
  TRYGDERETTEN: ['Trygderetten'],
  HELSENETTET: ['Helsenettet'],
  INGEN_DISTRIBUSJON: ['Ingen distribusjon'],
  DPV: ['DPV', 'Digital Post til Virksomhet'],
  DPVS: ['DPVS', 'Digital Post til Virksomhet (sensitiv)'],
  UKJENT: ['Ukjent'],
};

export const BACKGROUND_COLOR: Record<RelevantDatotype, string> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: 'var(--a-orange-50)',
  [RelevantDatotype.DATO_EKSPEDERT]: 'var(--a-deepblue-50)',
  [RelevantDatotype.DATO_JOURNALFOERT]: 'var(--a-blue-50)',
  [RelevantDatotype.DATO_REGISTRERT]: 'var(--a-purple-50)',
  [RelevantDatotype.DATO_AVS_RETUR]: 'var(--a-red-50)',
  [RelevantDatotype.DATO_DOKUMENT]: 'var(--a-limegreen-50)',
  [RelevantDatotype.DATO_LEST]: 'var(--a-green-50)',
};

export const ICON: Record<RelevantDatotype, React.FC> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: Print,
  [RelevantDatotype.DATO_EKSPEDERT]: Email,
  [RelevantDatotype.DATO_JOURNALFOERT]: FileFolder,
  [RelevantDatotype.DATO_REGISTRERT]: SaveFile,
  [RelevantDatotype.DATO_AVS_RETUR]: Cancel,
  [RelevantDatotype.DATO_DOKUMENT]: FileSuccess,
  [RelevantDatotype.DATO_LEST]: Glasses,
};
