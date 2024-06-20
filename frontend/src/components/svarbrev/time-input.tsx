import { TextField, ToggleGroup } from '@navikt/ds-react';
import {
  BEHANDLINGSTID_UNIT_TYPES,
  BEHANDLINGSTID_UNIT_TYPE_NAMES,
  BehandlingstidUnitType,
  isBehandlingstidUnitType,
} from '@app/types/svarbrev';

interface Props {
  value: number;
  onChange: (value: number) => void;
  unit: BehandlingstidUnitType;
  setUnit: (unit: BehandlingstidUnitType) => void;
}

export const TimeInput = ({ value, onChange, unit, setUnit }: Props) => (
  <>
    <TextField
      size="small"
      type="number"
      inputMode="numeric"
      min={1}
      value={value}
      onChange={({ target }) => onChange(Number.parseInt(target.value, 10))}
      label="Saksbehandlingstid"
      hideLabel
      style={{ width: 60 }}
    />

    <ToggleGroup
      value={unit}
      onChange={(v) => setUnit(isBehandlingstidUnitType(v) ? v : unit)}
      size="small"
      variant="neutral"
    >
      {BEHANDLINGSTID_UNIT_TYPES.map((type) => (
        <ToggleGroup.Item key={type} value={type} label={BEHANDLINGSTID_UNIT_TYPE_NAMES[type]} />
      ))}
    </ToggleGroup>
  </>
);
