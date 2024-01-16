import { DISTRIBUTION_TYPE_NAMES, DistribusjonsType } from '@app/types/documents/documents';

export const OPTIONS_LIST = [
  {
    label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.VEDTAKSBREV],
    value: DistribusjonsType.VEDTAKSBREV,
  },
  {
    label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.BESLUTNING],
    value: DistribusjonsType.BESLUTNING,
  },
  {
    label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.BREV],
    value: DistribusjonsType.BREV,
  },
  {
    label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.NOTAT],
    value: DistribusjonsType.NOTAT,
  },
];
