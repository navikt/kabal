import { formatIdNumber } from '@app/functions/format-id';
import type { ISetFullmektigParams } from '@app/types/oppgavebehandling/params';

export const getFullmektigMessage = (fullmektig: ISetFullmektigParams['fullmektig']) => {
  if (fullmektig === null) {
    return 'Fullmektig fjernet';
  }

  const { name, identifikator, address } = fullmektig;

  if (identifikator !== null) {
    return `Fullmektig satt til ${name} (${formatIdNumber(identifikator)})`;
  }

  return address === null ? (
    `Fullmektig satt til ${name}`
  ) : (
    <div>
      Fullmektig satt til:
      <div className="whitespace-pre-wrap border-l-2 border-l-border-subtle pl-2 italic">
        <div className="mb-1">{name}</div>

        <Line>{address.adresselinje1}</Line>
        <Line>{address.adresselinje2}</Line>
        <Line>{address.adresselinje3}</Line>
        <div>{address.landkode}</div>
        <Line>{address.postnummer}</Line>
      </div>
    </div>
  );
};

const Line = ({ children }: { children: string | null }) =>
  children === null || children.length === 0 ? null : <div>{children}</div>;

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
      name,
      identifikator: null,
      address: {
        adresselinje1: valueOrNull(address.adresselinje1),
        adresselinje2: valueOrNull(address.adresselinje2),
        adresselinje3: valueOrNull(address.adresselinje3),
        landkode: address.landkode,
        postnummer: valueOrNull(address.postnummer),
      },
    };
  }

  if (address === null && name === null) {
    return { address: null, name: null, identifikator: null };
  }

  throw new Error(`Feil ved lagring av fullmektig: ${JSON.stringify({ address, fullmektig, name })}`);
};

const valueOrNull = (value: string | null): string | null => (value !== null && value.length > 0 ? value : null);
