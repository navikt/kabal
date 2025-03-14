import { PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { BehandlingstidUnitType } from '@app/types/svarbrev';
import { Label, VStack } from '@navikt/ds-react';
import { addMonths, addWeeks, format } from 'date-fns';

interface Props {
  units: number;
  typeId: BehandlingstidUnitType;
}

export const BeregnetFrist = ({ units, typeId }: Props) => (
  <VStack>
    <Label size="small">Beregnet frist</Label>
    <div className="mt-3">{Number.isNaN(units) ? '-' : getNewDate(units, typeId)}</div>
  </VStack>
);

const NOW = new Date();

const getNewDate = (units: number, typeId: BehandlingstidUnitType): string => {
  switch (typeId) {
    case BehandlingstidUnitType.WEEKS:
      return format(addWeeks(NOW, units), PRETTY_FORMAT);
    case BehandlingstidUnitType.MONTHS:
      return format(addMonths(NOW, units), PRETTY_FORMAT);
  }
};
