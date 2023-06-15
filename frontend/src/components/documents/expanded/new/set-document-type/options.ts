import { DistribusjonsType } from '@app/types/documents/documents';

export const OPTIONS_MAP: Record<DistribusjonsType, string> = {
  [DistribusjonsType.VEDTAKSBREV]: 'Vedtaksbrev',
  [DistribusjonsType.BESLUTNING]: 'Beslutningsbrev',
  [DistribusjonsType.BREV]: 'Brev',
  [DistribusjonsType.NOTAT]: 'Notat',
};

export const OPTIONS_LIST = [
  {
    label: OPTIONS_MAP[DistribusjonsType.VEDTAKSBREV],
    value: DistribusjonsType.VEDTAKSBREV,
  },
  {
    label: OPTIONS_MAP[DistribusjonsType.BESLUTNING],
    value: DistribusjonsType.BESLUTNING,
  },
  {
    label: OPTIONS_MAP[DistribusjonsType.BREV],
    value: DistribusjonsType.BREV,
  },
  {
    label: OPTIONS_MAP[DistribusjonsType.NOTAT],
    value: DistribusjonsType.NOTAT,
  },
];
