import {
  ArrowUndoIcon,
  EnvelopeClosedIcon,
  FileCheckmarkIcon,
  FolderFileIcon,
  GlassesIcon,
  HddUpIcon,
  PrinterSmallIcon,
} from '@navikt/aksel-icons';
import { RelevantDatotype } from '@app/types/arkiverte-documents';

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
  [RelevantDatotype.DATO_SENDT_PRINT]: PrinterSmallIcon,
  [RelevantDatotype.DATO_EKSPEDERT]: EnvelopeClosedIcon,
  [RelevantDatotype.DATO_JOURNALFOERT]: FolderFileIcon,
  [RelevantDatotype.DATO_REGISTRERT]: HddUpIcon,
  [RelevantDatotype.DATO_AVS_RETUR]: ArrowUndoIcon,
  [RelevantDatotype.DATO_DOKUMENT]: FileCheckmarkIcon,
  [RelevantDatotype.DATO_LEST]: GlassesIcon,
};
