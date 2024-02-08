import { IAddress } from '@app/types/documents/recipients';

export const areAddressesEqual = (a: IAddress, b: IAddress) => {
  if (a === b) {
    return true;
  }

  return (
    a.adresselinje1 === b.adresselinje1 &&
    a.adresselinje2 === b.adresselinje2 &&
    a.adresselinje3 === b.adresselinje3 &&
    a.landkode === b.landkode &&
    a.postnummer === b.postnummer
  );
};
