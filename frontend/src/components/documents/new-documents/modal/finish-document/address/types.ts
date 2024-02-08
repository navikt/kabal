import { IAddress } from '@app/types/documents/recipients';

export interface Addresses {
  address: IAddress;
  overriddenAddress: IAddress | null;
}
