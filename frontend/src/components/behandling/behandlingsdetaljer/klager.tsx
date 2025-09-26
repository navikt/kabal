import type { InvalidReceiver } from '@app/components/part/edit-part';
import { Part } from '@app/components/part/part';
import { isValidOrgnr } from '@app/domain/orgnr';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IPart } from '@app/types/oppgave-common';
import { Alert, VStack } from '@navikt/ds-react';

interface Props {
  klager: IPart;
  isLoading: boolean;
  onChange: (klager: IPart) => void;
  typeId: SaksTypeEnum;
  invalidReceivers?: InvalidReceiver[];
}

export const Klager = ({ klager, isLoading, onChange, typeId, invalidReceivers }: Props) => {
  const [heading, inlineLabel] = getLabel(typeId);

  return (
    <VStack gap="2">
      <Part
        isDeletable={false}
        label={heading}
        part={klager}
        onChange={onChange}
        isLoading={isLoading}
        invalidReceivers={invalidReceivers}
      />

      <OrgWarning identifikator={klager.identifikator} label={inlineLabel} />
    </VStack>
  );
};

export const OrgWarning = ({ identifikator, label }: { identifikator: string | null; label: string }) => {
  if (identifikator === null || !isValidOrgnr(identifikator)) {
    return null;
  }

  return (
    <Alert size="small" variant="info">
      Er {label} arbeidsgiver? Da må du låse opp teksten <i>Har du spørsmål?</i> og endre telefonnummeret til 55 55 33
      36.
    </Alert>
  );
};

const getLabel = (typeId: SaksTypeEnum): [string, string] => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return ['Klager', 'klager'];
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return ['Den ankende part', 'ankende part'];
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return ['Opprinnelig klager / ankende part', 'opprinnelig klager / ankende part'];
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return ['Den som krever omgjøring', 'den som krever omgjøring'];
  }
};
