import { BehandlingstidUnitType } from '@app/types/svarbrev';
import { Alert } from '@navikt/ds-react';

interface Props {
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  behandlingstidUnits: number;
}

export const Warning = ({ behandlingstidUnits, behandlingstidUnitTypeId }: Props) => {
  const isTooLong =
    (behandlingstidUnitTypeId === BehandlingstidUnitType.MONTHS && behandlingstidUnits > 12) ||
    (behandlingstidUnitTypeId === BehandlingstidUnitType.WEEKS && behandlingstidUnits > 52);

  return isTooLong ? (
    <Alert variant="warning" size="small">
      Behandlingstiden er <strong>over ett år</strong>. Er du sikker på at dette er riktig?
    </Alert>
  ) : null;
};
