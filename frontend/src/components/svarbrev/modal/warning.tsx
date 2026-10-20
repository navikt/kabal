import { InfoBox } from '@/components/info-box/info-box';
import { BehandlingstidUnitType } from '@/types/svarbrev';

interface Props {
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  behandlingstidUnits: number;
}

export const Warning = ({ behandlingstidUnits, behandlingstidUnitTypeId }: Props) => {
  const isTooLong =
    (behandlingstidUnitTypeId === BehandlingstidUnitType.MONTHS && behandlingstidUnits > 12) ||
    (behandlingstidUnitTypeId === BehandlingstidUnitType.WEEKS && behandlingstidUnits > 52);

  return isTooLong ? (
    <InfoBox variant="warning">
      Behandlingstiden er <strong>over ett år</strong>. Er du sikker på at dette er riktig?
    </InfoBox>
  ) : null;
};
