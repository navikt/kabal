import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

export const getIsIncomingDocument = (document: IMainDocument | undefined): boolean => {
  if (document === undefined) {
    return false;
  }

  return (
    document.dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN ||
    document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST
  );
};
