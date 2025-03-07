import {
  setErrorMessage,
  useDebounce,
} from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
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
import { ErrorMessage, HStack, Heading, TextField, ToggleGroup, VStack } from '@navikt/ds-react';
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
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (prevVarsletFrist === null && typeof varsletFrist === 'string') {
      setTempValue('');
    }
  }, [varsletFrist, prevVarsletFrist]);

  const parsed = Number.parseInt(tempValue, 10);
  const skip = Number.isNaN(parsed) || parsed === units || (tempValue === '' && units === null);
  useDebounce(() => setUnits({ varsletBehandlingstidUnits: parsed, id }).unwrap(), skip, parsed, setError, 500);

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
          onChange={({ target }) => {
            if (numberRegex.test(target.value) || target.value === '') {
              setTempValue(target.value);
            }
          }}
        />

        <ToggleGroup
          style={{ width: 180 }}
          value={typeId}
          size="small"
          variant="neutral"
          onChange={async (typeId) => {
            if (!isBehandlingstidUnitType(typeId)) {
              return;
            }

            try {
              await setUnitType({ varsletBehandlingstidUnitTypeId: typeId, id }).unwrap();
              setError(undefined);
            } catch (e) {
              setErrorMessage(e, setError);
            }
          }}
        >
          {BEHANDLINGSTID_UNIT_TYPES.map((type) => (
            <ToggleGroup.Item
              key={type}
              value={type}
              label={
                parsed === 1 ? BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR[type] : BEHANDLINGSTID_UNIT_TYPE_NAMES[type]
              }
            />
          ))}
        </ToggleGroup>
      </HStack>
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};

const numberRegex = /^[0-9]+$/;
