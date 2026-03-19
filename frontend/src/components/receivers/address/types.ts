import type { IAddress } from '@/types/documents/receivers';

export interface Addresses {
  address: IAddress | null;
  overriddenAddress: IAddress | null;
}
