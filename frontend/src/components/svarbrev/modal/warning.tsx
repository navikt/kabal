import { Alert } from '@navikt/ds-react';
import { BehandlingstidUnitType } from '@app/types/svarbrev';

interface Props {
  behandlingstidUnitType: BehandlingstidUnitType;
  behandlingstidUnits: number;
}

export const Warning = ({ behandlingstidUnits, behandlingstidUnitType }: Props) => {
  const isTooLong =
    (behandlingstidUnitType === BehandlingstidUnitType.MONTHS && behandlingstidUnits > 12) ||
    (behandlingstidUnitType === BehandlingstidUnitType.WEEKS && behandlingstidUnits > 52);

  return isTooLong ? (
    <Alert variant="warning" size="small">
      Behandlingstiden er <strong>over ett år</strong>. Er du sikker på at dette er riktig?
    </Alert>
  ) : null;
};
