import type { IAddress } from '@app/types/documents/receivers';

export const areAddressesEqual = (a: IAddress | null, b: IAddress | null) => {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return (
    a.adresselinje1 === b.adresselinje1 &&
    a.adresselinje2 === b.adresselinje2 &&
    a.adresselinje3 === b.adresselinje3 &&
    a.landkode === b.landkode &&
    a.postnummer === b.postnummer
  );
};
