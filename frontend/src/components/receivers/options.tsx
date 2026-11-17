import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage, HStack, Loader, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { InfoBox } from '@/components/info-box/info-box';
import { Address } from '@/components/receivers/address/address';
import { areAddressesEqual } from '@/functions/are-addresses-equal';
import { useSearchPartWithUtsendingskanal } from '@/hooks/use-search-part-with-utsendingskanal';
import { getErrorMessage } from '@/hooks/use-suggested-brevmottakere';
import type { IMottaker } from '@/types/documents/documents';
import { HandlingEnum, type IAddress } from '@/types/documents/receivers';
import { UTSENDINGSKANAL, Utsendingskanal } from '@/types/oppgave-common';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

interface Props extends IMottaker {
  templateId: TemplateIdEnum | undefined;
  onChange: (mottaker: IMottaker) => void;
}

const useUtsendingskanal = (identifikator: string | null) => {
  const status = useSearchPartWithUtsendingskanal(identifikator === null ? skipToken : identifikator);

  if (identifikator === null) {
    return {
      currentData: { utsendingskanal: Utsendingskanal.SENTRAL_UTSKRIFT },
      isFetching: false,
      isSuccess: true,
      isError: false,
      error: undefined,
    };
  }

  return status;
};

export const Options = ({ part, handling, overriddenAddress, templateId, onChange }: Props) => {
  const { isFetching, isSuccess, isError, currentData, error } = useUtsendingskanal(part.identifikator);

  if (isFetching) {
    return <Loader size="small" />;
  }

  if (isError) {
    return <ErrorMessage size="small">{getErrorMessage(error) ?? 'Ukjent feil'}</ErrorMessage>;
  }

  if (!isSuccess) {
    return null;
  }

  const { utsendingskanal } = currentData;

  const onHandlingChange = (newHandling: string) =>
    onChange({ part, overriddenAddress, handling: ensureIsHandling(newHandling) });

  const onAddressChange = (address: IAddress | null) =>
    onChange({
      part,
      handling,
      overriddenAddress: areAddressesEqual(address, part.address) ? null : address,
    });

  const showAddress = () => {
    if (handling === HandlingEnum.AUTO) {
      return utsendingskanal === Utsendingskanal.SENTRAL_UTSKRIFT || utsendingskanal === Utsendingskanal.LOKAL_UTSKRIFT;
    }

    return handling === HandlingEnum.CENTRAL_PRINT || handling === HandlingEnum.LOCAL_PRINT;
  };

  const isLocalPrint = () => {
    if (handling === HandlingEnum.AUTO) {
      return utsendingskanal === Utsendingskanal.LOKAL_UTSKRIFT;
    }

    return handling === HandlingEnum.LOCAL_PRINT;
  };

  return (
    <>
      <HStack align="center" gap="space-0 space-8" paddingInline="space-8" paddingBlock="space-0 space-4">
        <ToggleGroup size="small" value={handling} onChange={onHandlingChange}>
          <ToggleGroup.Item value={HandlingEnum.AUTO} label={UTSENDINGSKANAL[utsendingskanal]} />
          {utsendingskanal !== Utsendingskanal.SENTRAL_UTSKRIFT ? (
            <ToggleGroup.Item value={HandlingEnum.CENTRAL_PRINT} label="Sentral utskrift" />
          ) : null}
          {utsendingskanal !== Utsendingskanal.LOKAL_UTSKRIFT ? (
            <ToggleGroup.Item value={HandlingEnum.LOCAL_PRINT} label="Lokal utskrift" />
          ) : null}
        </ToggleGroup>

        {handling === HandlingEnum.AUTO ? null : (
          <Tooltip content={`Tilbakestill til "${UTSENDINGSKANAL[utsendingskanal]}"`}>
            <Button
              data-color="neutral"
              size="small"
              variant="tertiary"
              onClick={() => onHandlingChange(HandlingEnum.AUTO)}
              icon={<ArrowUndoIcon aria-hidden />}
            />
          </Tooltip>
        )}
      </HStack>
      <HStack align="center" gap="space-0 space-8" paddingInline="space-8" paddingBlock="space-0 space-4">
        {isLocalPrint() ? (
          <InfoBox variant="info">
            <BodyShort size="small">Du må skrive ut dokumentet selv og legge det til utsending.</BodyShort>
            {templateId === TemplateIdEnum.OVERSENDELSESBREV ? (
              <BodyShort size="small">
                Husk at oversendelsesbrev på tilsvar skal sendes som rekommandert post.
              </BodyShort>
            ) : null}
          </InfoBox>
        ) : null}
      </HStack>
      {showAddress() ? (
        <Address
          part={part}
          address={part.address}
          overriddenAddress={overriddenAddress}
          onChange={onAddressChange}
          handling={handling}
        />
      ) : null}
    </>
  );
};

const ensureIsHandling = (handling: string): HandlingEnum => {
  if (
    handling === HandlingEnum.AUTO ||
    handling === HandlingEnum.LOCAL_PRINT ||
    handling === HandlingEnum.CENTRAL_PRINT
  ) {
    return handling;
  }

  return HandlingEnum.AUTO;
};
