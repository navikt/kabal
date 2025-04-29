import { DistribusjonsType, type IMainDocument } from '@app/types/documents/documents';

export const getIsIncomingDocument = (dokumentTypeId: IMainDocument['dokumentTypeId'] | undefined): boolean => {
  if (dokumentTypeId === undefined) {
    return false;
  }

  return (
    dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN ||
    dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST
  );
};
