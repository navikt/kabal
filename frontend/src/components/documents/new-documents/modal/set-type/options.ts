import { DistribusjonsType } from '@app/types/documents/documents';

export const OPTIONS_MAP: Record<DistribusjonsType, string> = {
  [DistribusjonsType.VEDTAKSBREV]: 'Vedtaksbrev',
  [DistribusjonsType.BESLUTNING]: 'Beslutningsbrev',
  [DistribusjonsType.BREV]: 'Brev',
  [DistribusjonsType.NOTAT]: 'Notat',
  [DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN]: 'Kjennelse fra Trygderetten',
};
