import { formatIdNumber } from '@app/functions/format-id';
import type { IAddress } from '@app/types/documents/recipients';
import type { ISetFullmektigParams } from '@app/types/oppgavebehandling/params';
import { styled } from 'styled-components';

export const getFullmektigMessage = (fullmektig: ISetFullmektigParams['fullmektig']) => {
  if (fullmektig === null) {
    return 'Fullmektig fjernet';
  }

  const { name, identifikator, address } = fullmektig;

  if (identifikator !== null) {
    return `Fullmektig satt til ${fullmektig.name} (${formatIdNumber(fullmektig.identifikator)})`;
  }

  return address === null ? (
    `Fullmektig satt til ${name}`
  ) : (
    <div>
      Fullmektig satt til:
      <StyledAddress>
        {name}
        <br />
        {addressToString(address)}
      </StyledAddress>
    </div>
  );
};

const StyledAddress = styled.address`
  border-left: 2px solid var(--a-border-subtle);
  padding-left: var(--a-spacing-2);
  font-style: italic;
  white-space: pre-wrap;
`;

const addNewlineIfNeeded = (value: string): string => (value.length > 0 ? `${value}\n` : value);

const addressToString = (address: IAddress): string => {
  const { adresselinje1, adresselinje2, adresselinje3, postnummer, landkode } = address;

  let value = adresselinje1 ?? '';

  if (adresselinje2 !== null && adresselinje2.length > 0) {
    value = addNewlineIfNeeded(value);
    value += adresselinje2;
  }

  if (adresselinje3 !== null && adresselinje3.length > 0) {
    value = addNewlineIfNeeded(value);
    value += adresselinje3;
  }

  value = addNewlineIfNeeded(value);
  value += landkode;

  if (postnummer !== null) {
    value += ` ${postnummer}`;
  }

  return value;
};

export const getFullmektigBody = (fullmektig: ISetFullmektigParams['fullmektig']) => {
  if (fullmektig === null) {
    return { fullmektig: null, address: null, name: null };
  }

  const { address, name, identifikator } = fullmektig;

  if (identifikator !== null) {
    return { identifikator, address: null, name: null };
  }

  if (address !== null && name !== null) {
    return {
      address: {
        ...address,
        adresselinje1: valueOrNull(address.adresselinje1),
        adresselinje2: valueOrNull(address.adresselinje2),
        adresselinje3: valueOrNull(address.adresselinje3),
        landkode: address.landkode,
        postnummer: valueOrNull(address.postnummer),
      },
      name,
      identifikator: null,
    };
  }

  if (address === null && name === null) {
    return { address: null, name: null, identifikator: null };
  }

  throw new Error(`Feil ved lagring av fullmektig: ${JSON.stringify({ address, fullmektig, name })}`);
};

const valueOrNull = (value: string | null): string | null => (value !== null && value.length > 0 ? value : null);
