interface BaseAddress {
  adresselinje2: string | null;
  adresselinje3: string | null;
}

interface NorwegianAddress extends BaseAddress {
  adresselinje1: string | null;
  postnummer: string;
  landkode: 'NO';
}

interface ForeignAddress extends BaseAddress {
  adresselinje1: string;
  postnummer: string | null;
  landkode: string;
}

export type IAddress = NorwegianAddress | ForeignAddress;

export const isNorwegianAddress = (address: IAddress): address is NorwegianAddress => address.landkode === 'NO';

export enum HandlingEnum {
  AUTO = 'AUTO',
  LOCAL_PRINT = 'LOCAL_PRINT',
  CENTRAL_PRINT = 'CENTRAL_PRINT',
}
