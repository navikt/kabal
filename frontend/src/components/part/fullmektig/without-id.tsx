import { StaticDataContext } from '@app/components/app/static-data-context';
import { Country } from '@app/components/receivers/address/country/country';
import { POSTNUMMER_ID, Postnummer } from '@app/components/receivers/address/postnummer';
import { toast } from '@app/components/toast/store';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { type IFullmektig, Utsendingskanal } from '@app/types/oppgave-common';
import { Box, type BoxProps, Button, ErrorSummary, HStack, Tag, TextField, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext, useState } from 'react';

interface Props {
  onClose: () => void;
  part: IFullmektig | null;
}

const NAME_ID = 'name';
const LINE1_ID = 'adresselinje1';
const LINE2_ID = 'adresselinje2';
const LINE3_ID = 'adresselinje3';

export const WithoutId = ({ part, onClose }: Props) => {
  const [setFullmektig, { isLoading, isError }] = useUpdateFullmektigMutation({
    fixedCacheKey: part?.id ?? 'temp',
  });

  const [name, setName] = useState(part?.name ?? '');

  const [adresselinje1, setAdresselinje1] = useState(part?.address?.adresselinje1 ?? '');
  const [adresselinje2, setAdresselinje2] = useState(part?.address?.adresselinje2 ?? '');
  const [adresselinje3, setAdresselinje3] = useState(part?.address?.adresselinje3 ?? '');
  const [landkode, setLandkode] = useState(part?.address?.landkode ?? 'NO');
  const [postnummer, setPostnummer] = useState(part?.address?.postnummer ?? null);

  const [nameError, setNameError] = useState(false);
  const [addresselinje1Error, setAddresselinje1Error] = useState(false);
  const [postnummerError, setPostnummerError] = useState(false);

  const oppgaveId = useOppgaveId();

  const { isPostnummer } = useContext(StaticDataContext);

  if (oppgaveId === skipToken) {
    return null;
  }

  const isNorway = landkode === 'NO';
  const validPostnummer = postnummer !== null && isPostnummer(postnummer);
  const validAdresselinje1 = adresselinje1.length > 0;

  const reset = () => {
    setName('');
    setAdresselinje1('');
    setAdresselinje2('');
    setAdresselinje3('');
    setLandkode('NO');
    setPostnummer(null);
  };

  const isValid = () => {
    setNameError(false);
    setAddresselinje1Error(false);
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
      setAddresselinje1Error(true);

      return false;
    }

    return true;
  };

  const isSaved =
    name === part?.name &&
    part.address !== null &&
    adresselinje1 === part.address.adresselinje1 &&
    adresselinje2 === part.address.adresselinje2 &&
    adresselinje3 === part.address.adresselinje3 &&
    landkode === part.address.landkode &&
    postnummer === part.address.postnummer;

  const save = async () => {
    if (!isValid()) {
      return;
    }

    if (isSaved) {
      return onClose();
    }

    const address = { adresselinje1, adresselinje2, adresselinje3, landkode };

    const fullmektig = {
      identifikator: null,
      type: null,
      statusList: [],
      utsendingskanal: Utsendingskanal.SENTRAL_UTSKRIFT,
      address,
      name,
      id: part?.id ?? 'temp',
    };

    if (isNorway) {
      await setFullmektig({ oppgaveId, fullmektig: { ...fullmektig, address: { ...address, postnummer } } }).unwrap();

      return onClose();
    }

    await setFullmektig({
      oppgaveId,
      fullmektig: { ...fullmektig, address: { ...address, postnummer: null } },
    }).unwrap();

    return onClose();
  };

  const onCountryChange = (newLandkode: string) => {
    setLandkode(newLandkode);

    if (newLandkode !== 'NO') {
      setPostnummer(null);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      e.stopPropagation();
      save().catch((error) => {
        toast.error('Kunne ikke lagre fullmektig. Prøv igjen senere.');
        console.error('Failed to save fullmektig:', error);
      });
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <Box
      background={getBackgroundColor(isSaved, isError)}
      padding="4"
      borderWidth="1"
      borderColor={getBorderColor(isSaved, isError)}
      borderRadius="medium"
    >
      <VStack onKeyDown={onKeyDown} gap="4">
        <Button size="small" variant="secondary" onClick={reset} style={{ width: 'min-content' }}>
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
          error={addresselinje1Error}
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
        <Country
          value={landkode ?? undefined}
          originalValue={landkode ?? undefined}
          onChange={onCountryChange}
          width="100%"
        />

        {isNorway ? (
          <Postnummer value={postnummer} originalValue={postnummer} onChange={setPostnummer} error={postnummerError} />
        ) : null}

        {addresselinje1Error || postnummerError || nameError ? (
          <ErrorSummary heading="Påkrevde felt mangler" size="small">
            {addresselinje1Error ? (
              <ErrorSummary.Item href={`#${LINE1_ID}`}>
                Adresselinje 1 må fylles ut for post til utlandet.
              </ErrorSummary.Item>
            ) : null}
            {postnummerError ? (
              <ErrorSummary.Item href={`#${POSTNUMMER_ID}`}>
                Gyldig postnummer må fylles ut for post i Norge.
              </ErrorSummary.Item>
            ) : null}

            {nameError ? <ErrorSummary.Item href={`#${NAME_ID}`}>Navn må fylles ut.</ErrorSummary.Item> : null}
          </ErrorSummary>
        ) : null}

        <HStack gap="2">
          <Button size="small" variant="primary" onClick={save} loading={isLoading}>
            Lagre
          </Button>
          <Button size="small" variant="secondary" onClick={onClose} loading={isLoading}>
            Avbryt
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const getBackgroundColor = (isSaved: boolean, isError: boolean): BoxProps['background'] => {
  if (isError) {
    return 'surface-danger-subtle';
  }

  return isSaved ? 'surface-success-subtle' : 'surface-action-subtle';
};

const getBorderColor = (isSaved: boolean, isError: boolean): BoxProps['borderColor'] => {
  if (isError) {
    return 'border-danger';
  }

  return isSaved ? 'border-success' : 'border-action';
};

const RequiredTag = ({ children }: { children: string }) => (
  <HStack gap="2">
    {children}
    <Tag variant="info" size="xsmall">
      Påkrevd
    </Tag>
  </HStack>
);
