import { BeregnetFrist } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/beregnet-frist';
import {
  setErrorMessage,
  useDebounce,
} from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { usePrevious } from '@app/hooks/use-previous';
import {
  useSetBehandlingstidUnitTypeMutation,
  useSetBehandlingstidUnitsMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { UtvidetBehandlingstidFieldName } from '@app/types/field-names';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES } from '@app/types/field-names';
import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR,
  BehandlingstidUnitType,
  isBehandlingstidUnitType,
} from '@app/types/svarbrev';
import { ErrorMessage, HStack, Heading, TextField, ToggleGroup, VStack } from '@navikt/ds-react';
import { addMonths, addWeeks, isAfter } from 'date-fns';
import { useEffect, useState } from 'react';

interface Props {
  typeId: BehandlingstidUnitType;
  units: number | null;
  varsletFrist: string | null;
  id: string;
}

export const SetBehandlingstid = ({ id, typeId, units, varsletFrist }: Props) => {
  const [setUnitType, { isLoading: setUnitTypeIsLoading }] = useSetBehandlingstidUnitTypeMutation({
    fixedCacheKey: id,
  });
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
  const isValid = getValid(parsed, typeId);
  const skip = Number.isNaN(parsed) || parsed === units || (tempValue === '' && units === null) || !isValid;
  useDebounce(() => setUnits({ varsletBehandlingstidUnits: parsed, id }).unwrap(), skip, parsed, setError, 500);

  return (
    <HStack gap="2">
      <VStack gap="1" as="section">
        <Heading size="xsmall" style={{ fontSize: 16 }}>
          {UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.behandlingstid]}
        </Heading>

        <HStack align="end" gap="2" as="section" id={UtvidetBehandlingstidFieldName.behandlingstid}>
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

              const parsed = Number.parseInt(target.value, 10);
              const isValid = getValid(parsed, typeId);

              setError(isValid ? undefined : 'Fristen kan ikke settes mer enn fire måneder frem i tid.');
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
                aria-disabled={setUnitTypeIsLoading}
                // @ts-expect-error missing type in ds-react
                disabled={setUnitTypeIsLoading}
                className={setUnitTypeIsLoading ? 'cursor-not-allowed opacity-30' : ''}
                label={
                  parsed === 1 ? BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR[type] : BEHANDLINGSTID_UNIT_TYPE_NAMES[type]
                }
              />
            ))}
          </ToggleGroup>
        </HStack>
        {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      </VStack>
      <BeregnetFrist units={parsed} typeId={typeId} />
    </HStack>
  );
};

const numberRegex = /^[0-9]+$/;
const NOW = new Date();
const maxDate = addMonths(NOW, 4);

const getValid = (units: number, type: BehandlingstidUnitType) => {
  switch (type) {
    case BehandlingstidUnitType.WEEKS:
      return !isAfter(addWeeks(NOW, units), maxDate);
    case BehandlingstidUnitType.MONTHS:
      return !isAfter(addMonths(NOW, units), maxDate);
  }
};
