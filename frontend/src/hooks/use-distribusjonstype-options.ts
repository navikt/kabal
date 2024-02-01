import { DISTRIBUTION_TYPE_NAMES, DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';

const OPTIONS_LIST = [
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

export const KJENNELSE_FRA_TRYGDERETTEN = {
  label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN],
  value: DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN,
};

export const ANNEN_INNGAAENDE_POST = {
  label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.ANNEN_INNGAAENDE_POST],
  value: DistribusjonsType.ANNEN_INNGAAENDE_POST,
};

interface Result {
  incoming: Option[];
  outgoing: Option[];
}

export const useDistribusjonstypeOptions = (type: DocumentTypeEnum): Result => {
  if (type !== DocumentTypeEnum.UPLOADED) {
    return { outgoing: OPTIONS_LIST, incoming: [] };
  }

  return { outgoing: OPTIONS_LIST, incoming: [KJENNELSE_FRA_TRYGDERETTEN, ANNEN_INNGAAENDE_POST] };
};

export interface Option {
  label: string;
  value: DistribusjonsType;
}
