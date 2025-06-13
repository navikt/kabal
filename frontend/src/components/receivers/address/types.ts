import type { IAddress } from '@app/types/documents/receivers';

export interface Addresses {
  address: IAddress | null;
  overriddenAddress: IAddress | null;
}
