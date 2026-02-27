import { Alert } from '@app/components/alert/alert';
import type { InvalidReceiver } from '@app/components/part/edit-part';
import { Part } from '@app/components/part/part';
import { isValidOrgnr } from '@app/domain/orgnr';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IPart } from '@app/types/oppgave-common';
import { VStack } from '@navikt/ds-react';

interface Props {
  klager: IPart;
  isLoading: boolean;
  onChange: (klager: IPart) => void;
  typeId: SaksTypeEnum;
  invalidReceivers?: InvalidReceiver[];
}

export const Klager = ({ klager, isLoading, onChange, typeId, invalidReceivers }: Props) => {
  const [heading, inlineLabel, buttonLabel] = getLabel(typeId);

  return (
    <VStack gap="space-8">
      <Part
        isDeletable={false}
        label={heading}
        buttonLabel={buttonLabel}
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
    <Alert variant="info">
      Er {label} arbeidsgiver? Da må du låse opp teksten <i>Har du spørsmål?</i> og endre telefonnummeret til 55 55 33
      36.
    </Alert>
  );
};

const getLabel = (typeId: SaksTypeEnum): [string, string, string] => {
  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return ['Klager', 'klager', 'Endre klager'];
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return ['Den ankende part', 'ankende part', 'Endre ankende part'];
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return [
        'Opprinnelig klager / ankende part',
        'opprinnelig klager / ankende part',
        'Endre opprinnelig klager / ankende part',
      ];
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return ['Den som krever omgjøring', 'den som krever omgjøring', 'Endre den som krever omgjøring'];
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return ['Den som begjærer gjenopptak', 'den som begjærer gjenopptak', 'Endre den som begjærer gjenopptak'];
    default:
      return ['Klager', 'klager', 'Endre klager'];
  }
};
