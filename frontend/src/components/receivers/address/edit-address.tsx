import { StaticDataContext } from '@app/components/app/static-data-context';
import { Country } from '@app/components/receivers/address/country/country';
import { AddressField } from '@app/components/receivers/address/field';
import { AddressState, Container } from '@app/components/receivers/address/layout';
import { Postnummer } from '@app/components/receivers/address/postnummer';
import type { Addresses } from '@app/components/receivers/address/types';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import { Keys, isMetaKey } from '@app/keys';
import type { IAddress } from '@app/types/documents/recipients';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, ErrorSummary, HStack, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useState } from 'react';

interface EditProps extends Addresses {
  onSave: (address: IAddress | null) => void;
  onCancel: () => void;
}

export const EditAddress = ({ address, overriddenAddress, onSave, onCancel }: EditProps) => {
  const currentAddress = overriddenAddress ?? address;
  const [adresselinje1, setAdresselinje1] = useState(currentAddress?.adresselinje1 ?? null);
  const [adresselinje2, setAdresselinje2] = useState(currentAddress?.adresselinje2 ?? null);
  const [adresselinje3, setAdresselinje3] = useState(currentAddress?.adresselinje3 ?? null);
  const [landkode, setLandkode] = useState(currentAddress?.landkode ?? 'NO');
  const [postnummer, setPostnummer] = useState(currentAddress?.postnummer ?? null);

  const [addresseLinje1Error, setAddresseLinje1Error] = useState(false);
  const [postnummerError, setPostnummerError] = useState(false);

  const { isPostnummer } = useContext(StaticDataContext);

  const isOverridden = useMemo(
    () => overriddenAddress !== null && !areAddressesEqual(overriddenAddress, address),
    [address, overriddenAddress],
  );

  const isSaved = useMemo(
    () =>
      currentAddress !== null &&
      adresselinje1 === currentAddress.adresselinje1 &&
      adresselinje2 === currentAddress.adresselinje2 &&
      adresselinje3 === currentAddress.adresselinje3 &&
      landkode === currentAddress.landkode &&
      postnummer === currentAddress.postnummer,
    [adresselinje1, adresselinje2, adresselinje3, currentAddress, landkode, postnummer],
  );

  const isNorway = landkode === 'NO';

  const validate = useCallback(() => {
    if (isNorway) {
      if (postnummer === null || !isPostnummer(postnummer)) {
        setPostnummerError(true);

        return false;
      }
    } else if (adresselinje1 === null || adresselinje1.length === 0) {
      setAddresseLinje1Error(true);

      return false;
    }

    return true;
  }, [adresselinje1, isNorway, isPostnummer, postnummer]);

  const save = useCallback(() => {
    if (!validate()) {
      return;
    }

    if (isSaved) {
      return onCancel();
    }

    const isOriginalAddress =
      address !== null &&
      adresselinje1 === address.adresselinje1 &&
      adresselinje2 === address.adresselinje2 &&
      adresselinje3 === address.adresselinje3 &&
      landkode === address.landkode &&
      postnummer === address.postnummer;

    if (isOriginalAddress) {
      return onSave(null);
    }

    if (isNorway) {
      if (postnummer !== null) {
        onSave({ adresselinje1, adresselinje2, adresselinje3, landkode, postnummer });
      }
    } else if (adresselinje1 !== null) {
      onSave({ adresselinje1, adresselinje2, adresselinje3, landkode, postnummer: null });
    }
  }, [
    address,
    adresselinje1,
    adresselinje2,
    adresselinje3,
    isNorway,
    postnummer,
    landkode,
    isSaved,
    onCancel,
    onSave,
    validate,
  ]);

  const onCountryChange = useCallback((newLandkode: string) => {
    setLandkode(newLandkode);

    if (newLandkode !== 'NO') {
      setPostnummer(null);
    }
  }, []);

  const addressState = useMemo(() => {
    if (isSaved) {
      if (isOverridden) {
        return AddressState.OVERRIDDEN;
      }

      return AddressState.SAVED;
    }

    return AddressState.UNSAVED;
  }, [isSaved, isOverridden]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.Enter || (isMetaKey(e) && e.key.toLowerCase() === Keys.S)) {
        e.preventDefault();
        e.stopPropagation();
        save();
      }

      if (e.key === Keys.Escape) {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
    },
    [onCancel, save],
  );

  return (
    <Container $state={addressState} onKeyDown={onKeyDown}>
      <AddressField
        id="adresselinje1"
        label="Adresselinje 1"
        value={adresselinje1}
        originalValue={address?.adresselinje1 ?? null}
        onChange={setAdresselinje1}
        autoFocus
        required={!isNorway}
        error={addresseLinje1Error}
      />
      <AddressField
        label="Adresselinje 2"
        value={adresselinje2}
        originalValue={address?.adresselinje2 ?? null}
        onChange={setAdresselinje2}
      />
      <AddressField
        label="Adresselinje 3"
        value={adresselinje3}
        originalValue={address?.adresselinje3 ?? null}
        onChange={setAdresselinje3}
      />
      <Country value={landkode ?? undefined} originalValue={address?.landkode} onChange={onCountryChange} />
      {isNorway ? (
        <Postnummer
          value={postnummer}
          originalValue={address?.postnummer ?? null}
          onChange={setPostnummer}
          error={postnummerError}
        />
      ) : null}
      {addresseLinje1Error || postnummerError ? (
        <ErrorSummary heading="Påkrevde felt mangler" size="small">
          {addresseLinje1Error ? (
            <ErrorSummary.Item href="#adresselinje1">
              Adresselinje 1 må fylles ut for post til utlandet.
            </ErrorSummary.Item>
          ) : null}
          {postnummerError ? (
            <ErrorSummary.Item href="#postnummer">Gyldig postnummer må fylles ut for post i Norge.</ErrorSummary.Item>
          ) : null}
        </ErrorSummary>
      ) : null}
      <HStack align="center" gap="1">
        <Button size="small" variant="primary" onClick={save}>
          Lagre
        </Button>
        <Button size="small" variant="secondary" onClick={onCancel}>
          Avbryt
        </Button>
        {isOverridden ? (
          <Tooltip content="Tilbakestill til original adresse.">
            <Button size="small" variant="tertiary" onClick={() => onSave(null)} icon={<ArrowUndoIcon aria-hidden />}>
              Tilbakestill
            </Button>
          </Tooltip>
        ) : null}
      </HStack>
    </Container>
  );
};
