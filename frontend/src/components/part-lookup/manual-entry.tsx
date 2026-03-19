import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, ErrorSummary, HStack, Tag, TextField, VStack } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { Country } from '@/components/receivers/address/country/country';
import { POSTNUMMER_ID, Postnummer } from '@/components/receivers/address/postnummer';
import { isMetaKey } from '@/keys';
import type { IFullmektig } from '@/types/oppgave-common';
import { Utsendingskanal } from '@/types/oppgave-common';

const NAME_ID = 'fullmektig-name';
const LINE1_ID = 'fullmektig-adresselinje1';
const LINE2_ID = 'fullmektig-adresselinje2';
const LINE3_ID = 'fullmektig-adresselinje3';

interface ManualEntryProps {
  part: IFullmektig | null;
  onSave: (fullmektig: IFullmektig) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ManualEntry = ({ part, onSave, onCancel, isLoading }: ManualEntryProps) => {
  const [name, setName] = useState(part?.name ?? '');
  const [adresselinje1, setAdresselinje1] = useState(part?.address?.adresselinje1 ?? '');
  const [adresselinje2, setAdresselinje2] = useState(part?.address?.adresselinje2 ?? '');
  const [adresselinje3, setAdresselinje3] = useState(part?.address?.adresselinje3 ?? '');
  const [landkode, setLandkode] = useState(part?.address?.landkode ?? 'NO');
  const [postnummer, setPostnummer] = useState(part?.address?.postnummer ?? null);

  const [nameError, setNameError] = useState(false);
  const [adresselinje1Error, setAdresselinje1Error] = useState(false);
  const [postnummerError, setPostnummerError] = useState(false);

  const { isPostnummer } = useContext(StaticDataContext);

  const isNorway = landkode === 'NO';
  const validPostnummer = postnummer !== null && isPostnummer(postnummer);
  const validAdresselinje1 = adresselinje1.length > 0;

  const validate = (): boolean => {
    setNameError(false);
    setAdresselinje1Error(false);
    setPostnummerError(false);

    if (name.length === 0) {
      setNameError(true);

      return false;
    }

    if (isNorway) {
      if (!validPostnummer) {
        setPostnummerError(true);

        return false;
      }
    } else if (!validAdresselinje1) {
      setAdresselinje1Error(true);

      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const address = {
      adresselinje1,
      adresselinje2,
      adresselinje3,
      landkode,
      postnummer: isNorway ? postnummer : null,
    };

    const fullmektig: IFullmektig = {
      identifikator: null,
      type: null,
      statusList: [],
      utsendingskanal: Utsendingskanal.SENTRAL_UTSKRIFT,
      address,
      name,
      id: part?.id ?? 'temp',
    };

    onSave(fullmektig);
  };

  const handleReset = () => {
    setName('');
    setAdresselinje1('');
    setAdresselinje2('');
    setAdresselinje3('');
    setLandkode('NO');
    setPostnummer(null);
    setNameError(false);
    setAdresselinje1Error(false);
    setPostnummerError(false);
  };

  const onCountryChange = (newLandkode: string) => {
    setLandkode(newLandkode);

    if (newLandkode !== 'NO') {
      setPostnummer(null);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isMetaKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    }
  };

  const hasErrors = nameError || adresselinje1Error || postnummerError;

  return (
    <VStack onKeyDown={onKeyDown} gap="space-12">
      <Button data-color="neutral" size="small" variant="secondary" onClick={handleReset} className="w-min">
        Nullstill
      </Button>

      <TextField
        id={NAME_ID}
        label={<RequiredTag>Navn</RequiredTag>}
        value={name}
        onChange={({ target }) => setName(target.value)}
        autoFocus
        error={nameError}
        size="small"
      />

      <TextField
        id={LINE1_ID}
        label={isNorway ? 'Adresselinje 1' : <RequiredTag>Adresselinje 1</RequiredTag>}
        value={adresselinje1}
        onChange={({ target }) => setAdresselinje1(target.value)}
        error={adresselinje1Error}
        size="small"
      />

      <TextField
        id={LINE2_ID}
        label="Adresselinje 2"
        value={adresselinje2}
        onChange={({ target }) => setAdresselinje2(target.value)}
        size="small"
      />

      <TextField
        id={LINE3_ID}
        label="Adresselinje 3"
        value={adresselinje3}
        onChange={({ target }) => setAdresselinje3(target.value)}
        size="small"
      />

      <Country value={landkode} originalValue={landkode} onChange={onCountryChange} width="100%" />

      {isNorway ? (
        <Postnummer value={postnummer} originalValue={postnummer} onChange={setPostnummer} error={postnummerError} />
      ) : null}

      {hasErrors ? (
        <ErrorSummary heading="Påkrevde felt mangler" size="small">
          {nameError ? <ErrorSummary.Item href={`#${NAME_ID}`}>Navn må fylles ut.</ErrorSummary.Item> : null}
          {adresselinje1Error ? (
            <ErrorSummary.Item href={`#${LINE1_ID}`}>
              Adresselinje 1 må fylles ut for post til utlandet.
            </ErrorSummary.Item>
          ) : null}
          {postnummerError ? (
            <ErrorSummary.Item href={`#${POSTNUMMER_ID}`}>
              Gyldig postnummer må fylles ut for post i Norge.
            </ErrorSummary.Item>
          ) : null}
        </ErrorSummary>
      ) : null}

      <Button
        size="small"
        variant={'primary'}
        onClick={handleSave}
        loading={isLoading}
        className="w-full"
        icon={<CheckmarkIcon aria-hidden />}
      >
        Endre fullmektig
      </Button>
    </VStack>
  );
};

const RequiredTag = ({ children }: { children: string }) => (
  <HStack gap="space-8">
    {children}
    <Tag data-color="info" variant="outline" size="xsmall">
      Påkrevd
    </Tag>
  </HStack>
);
