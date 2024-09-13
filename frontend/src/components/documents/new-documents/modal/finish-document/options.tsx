import { Address } from '@app/components/documents/new-documents/modal/finish-document/address/address';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import type { IMottaker } from '@app/types/documents/documents';
import { HandlingEnum, type IAddress } from '@app/types/documents/recipients';
import { UTSENDINGSKANAL, Utsendingskanal } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { styled } from 'styled-components';

interface Props extends IMottaker {
  templateId: TemplateIdEnum | undefined;
  onChange: (mottaker: IMottaker) => void;
}

export const Options = ({ part, handling, overriddenAddress, templateId, onChange }: Props) => {
  const onHandlingChange = useCallback(
    (newHandling: string) => onChange({ part, overriddenAddress, handling: ensureIsHandling(newHandling) }),
    [onChange, overriddenAddress, part],
  );

  const onAddressChange = useCallback(
    (address: IAddress | null) =>
      onChange({
        part,
        handling,
        overriddenAddress: areAddressesEqual(address, part.address) ? null : address,
      }),
    [handling, onChange, part],
  );

  const showAddress = useMemo(() => {
    if (handling === HandlingEnum.AUTO) {
      return (
        part.utsendingskanal === Utsendingskanal.SENTRAL_UTSKRIFT ||
        part.utsendingskanal === Utsendingskanal.LOKAL_UTSKRIFT
      );
    }

    return handling === HandlingEnum.CENTRAL_PRINT || handling === HandlingEnum.LOCAL_PRINT;
  }, [handling, part.utsendingskanal]);

  const isLocalPrint = useMemo(() => {
    if (handling === HandlingEnum.AUTO) {
      return part.utsendingskanal === Utsendingskanal.LOKAL_UTSKRIFT;
    }

    return handling === HandlingEnum.LOCAL_PRINT;
  }, [handling, part.utsendingskanal]);

  return (
    <>
      <Row>
        <ToggleGroup size="small" value={handling} onChange={onHandlingChange}>
          <ToggleGroup.Item value={HandlingEnum.AUTO}>{UTSENDINGSKANAL[part.utsendingskanal]}</ToggleGroup.Item>
          {part.utsendingskanal !== Utsendingskanal.SENTRAL_UTSKRIFT ? (
            <ToggleGroup.Item value={HandlingEnum.CENTRAL_PRINT}>Sentral utskrift</ToggleGroup.Item>
          ) : null}
          {part.utsendingskanal !== Utsendingskanal.LOKAL_UTSKRIFT ? (
            <ToggleGroup.Item value={HandlingEnum.LOCAL_PRINT}>Lokal utskrift</ToggleGroup.Item>
          ) : null}
        </ToggleGroup>

        {handling === HandlingEnum.AUTO ? null : (
          <Tooltip content={`Tilbakestill til "${UTSENDINGSKANAL[part.utsendingskanal]}"`}>
            <Button
              size="small"
              variant="tertiary"
              onClick={() => onHandlingChange(HandlingEnum.AUTO)}
              icon={<ArrowUndoIcon aria-hidden />}
            />
          </Tooltip>
        )}
      </Row>
      <Row>
        {isLocalPrint ? (
          <Alert size="small" variant="info">
            <BodyShort size="small">Du må skrive ut dokumentet selv og legge det til utsending.</BodyShort>
            {templateId === TemplateIdEnum.OVERSENDELSESBREV ? (
              <BodyShort size="small">
                Husk at oversendelsesbrev på tilsvar skal sendes som rekommandert post.
              </BodyShort>
            ) : null}
          </Alert>
        ) : null}
      </Row>
      {showAddress ? (
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

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-2);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  padding-bottom: var(--a-spacing-1);
`;

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
