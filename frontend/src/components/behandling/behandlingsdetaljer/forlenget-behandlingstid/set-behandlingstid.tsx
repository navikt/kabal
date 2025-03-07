import { useDebounce } from '@app/hooks/use-debounce';
import { usePrevious } from '@app/hooks/use-previous';
import {
  useSetBehandlingstidUnitTypeMutation,
  useSetBehandlingstidUnitsMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR,
  type BehandlingstidUnitType,
  isBehandlingstidUnitType,
} from '@app/types/svarbrev';
import { HStack, Heading, TextField, ToggleGroup, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface Props {
  typeId: BehandlingstidUnitType;
  units: number | null;
  varsletFrist: string | null;
  id: string;
}

export const SetBehandlingstid = ({ id, typeId, units, varsletFrist }: Props) => {
  const [setUnitType] = useSetBehandlingstidUnitTypeMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(units?.toString() ?? '');
  const [setUnits] = useSetBehandlingstidUnitsMutation({ fixedCacheKey: id });
  const prevVarsletFrist = usePrevious(varsletFrist);

  useEffect(() => {
    if (prevVarsletFrist === null && typeof varsletFrist === 'string') {
      setTempValue('');
    }
  }, [varsletFrist, prevVarsletFrist]);

  const parsed = Number.parseInt(tempValue, 10);
  const skip = Number.isNaN(parsed) || parsed === units || (tempValue === '' && units === null);

  useDebounce(() => setUnits({ varsletBehandlingstidUnits: parsed, id }), 500, skip);

  return (
    <VStack gap="1" as="section">
      <Heading size="xsmall" style={{ fontSize: 16 }}>
        Ny behandlingstid
      </Heading>

      <HStack align="end" gap="2" as="section">
        <TextField
          label={`Antall ${BEHANDLINGSTID_UNIT_TYPE_NAMES[typeId]}`}
          hideLabel
          size="small"
          value={tempValue}
          type="number"
          min={1}
          style={{ width: 60 }}
          onChange={({ target }) => setTempValue(target.value)}
        />

        <ToggleGroup
          style={{ width: 180 }}
          value={typeId}
          size="small"
          variant="neutral"
          onChange={(typeId) => {
            if (isBehandlingstidUnitType(typeId)) {
              setUnitType({ varsletBehandlingstidUnitTypeId: typeId, id });
            }
          }}
        >
          {BEHANDLINGSTID_UNIT_TYPES.map((type) => (
            <ToggleGroup.Item
              key={type}
              value={type}
              label={units === 1 ? BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR[type] : BEHANDLINGSTID_UNIT_TYPE_NAMES[type]}
            />
          ))}
        </ToggleGroup>
      </HStack>
    </VStack>
  );
};
