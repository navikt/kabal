import { Cancel, Email, FileFolder, FileSuccess, Glasses, Print, SaveFile } from '@navikt/ds-icons';
import { RelevantDatotype } from '../../../../../types/arkiverte-documents';

export const DATOTYPE_NAME: Record<RelevantDatotype, string> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: 'Sendt print',
  [RelevantDatotype.DATO_EKSPEDERT]: 'Ekspedert',
  [RelevantDatotype.DATO_JOURNALFOERT]: 'Journalført',
  [RelevantDatotype.DATO_REGISTRERT]: 'Registrert',
  [RelevantDatotype.DATO_AVS_RETUR]: 'Avsender retur',
  [RelevantDatotype.DATO_DOKUMENT]: 'Opprettet',
  [RelevantDatotype.DATO_LEST]: 'Lest',
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
