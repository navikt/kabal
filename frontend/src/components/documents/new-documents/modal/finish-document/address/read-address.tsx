import { PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Tag, Tooltip } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import {
  AddressState,
  Container,
  Row,
} from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { Addresses } from '@app/components/documents/new-documents/modal/finish-document/address/types';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { IAddress, isNorwegianAddress } from '@app/types/documents/recipients';
import { IPart } from '@app/types/oppgave-common';

interface Props extends Addresses {
  part: IPart;
  onEdit: (() => void) | undefined;
}

export const ReadAddress = ({ part, address, overriddenAddress, onEdit }: Props) => {
  const isEditable = onEdit !== undefined;
  const addressLines = useAddressLines(isEditable ? overriddenAddress ?? address : address);
  const copyAddress = formatCopyAddress(part, addressLines);
  const isOverridden = isEditable && overriddenAddress !== null && !areAddressesEqual(address, overriddenAddress);

  const noAddress = addressLines.length === 0;

  return (
    <Container $state={isOverridden ? AddressState.OVERRIDDEN : AddressState.SAVED}>
      <Row>
        <span>{noAddress ? 'Ingen adresse' : addressLines.join(', ')}</span>

        {noAddress ? null : (
          <Tooltip content="Kopier navn og adresse">
            <CopyButton size="xsmall" variant="neutral" copyText={copyAddress} title="Kopier navn og adresse" />
          </Tooltip>
        )}

        {onEdit === undefined ? null : (
          <Tooltip content="Overstyr adressen kun for dette dokumentet.">
            <Button size="xsmall" variant="tertiary" onClick={onEdit} icon={<PencilIcon aria-hidden />}>
              Endre
            </Button>
          </Tooltip>
        )}

        {isOverridden ? (
          <Tag variant="warning" size="small">
            Overstyrt
          </Tag>
        ) : null}
      </Row>
    </Container>
  );
};

const useAddressLines = (address: IAddress | null): string[] => {
  const { getPoststed, getCountryName } = useContext(StaticDataContext);

  if (address === null) {
    return [];
  }

  const country = getCountryName(address.landkode) ?? address.landkode;

  return [
    address.adresselinje1,
    address.adresselinje2,
    address.adresselinje3,
    isNorwegianAddress(address)
      ? `${address.postnummer} ${getPoststed(address.postnummer) ?? address.postnummer}`
      : null,
    country,
  ].filter((line): line is string => isNotNull(line) && line.trim().length !== 0);
};

const formatCopyAddress = (part: IPart, addressLines: string[]): string => [part.name, ...addressLines].join('\n');
