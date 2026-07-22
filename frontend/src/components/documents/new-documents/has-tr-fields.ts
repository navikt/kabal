import { DistribusjonsType, type IParentDocument } from '@/types/documents/documents';

export const hasTrFields = ({ dokumentTypeId }: Pick<IParentDocument, 'dokumentTypeId'>) =>
  dokumentTypeId === DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN;
