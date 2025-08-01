import { DISTRIBUTION_TYPE_NAMES, DistribusjonsType, DocumentTypeEnum } from '@app/types/documents/documents';

const SMART_DOCUMENT_OPTIONS = [
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

const KJENNELSE_FRA_TRYGDERETTEN = {
  label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN],
  value: DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN,
};

const ANNEN_INNGAAENDE_POST = {
  label: DISTRIBUTION_TYPE_NAMES[DistribusjonsType.ANNEN_INNGAAENDE_POST],
  value: DistribusjonsType.ANNEN_INNGAAENDE_POST,
};

const UPLOADED_OPTIONS = [...SMART_DOCUMENT_OPTIONS, KJENNELSE_FRA_TRYGDERETTEN, ANNEN_INNGAAENDE_POST];

interface Result {
  options: DistribusjonsTypeOption[];
  explanation: string;
}

export const useDistribusjonstypeOptions = (type: DocumentTypeEnum): Result => {
  if (type === DocumentTypeEnum.SMART) {
    return {
      options: SMART_DOCUMENT_OPTIONS,
      explanation: 'Kan ikke endres til inngående typer fordi det er et smartdokument',
    };
  }

  return {
    options: UPLOADED_OPTIONS,
    explanation: 'Kan endres til alle typer',
  };
};

export interface DistribusjonsTypeOption {
  label: string;
  value: DistribusjonsType;
}
