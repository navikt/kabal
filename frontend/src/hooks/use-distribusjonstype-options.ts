import { OPTIONS_MAP } from '@app/components/documents/new-documents/modal/set-type/options';
import { DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';

const OPTIONS_LIST = [
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

const KJENNELSE_FRA_TRYGDERETTEN = {
  label: OPTIONS_MAP[DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN],
  value: DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN,
};

export const useDistribusjonstypeOptions = (type: DocumentTypeEnum) => {
  if (type !== DocumentTypeEnum.UPLOADED) {
    return OPTIONS_LIST;
  }

  return [...OPTIONS_LIST, KJENNELSE_FRA_TRYGDERETTEN];
};
