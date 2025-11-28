import type { IKodeverkSimpleValue, IKodeverkValue } from '@app/types/kodeverk';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Checkbox, CheckboxGroup, HStack, TextField, VStack } from '@navikt/ds-react';
import { type ReactNode, useMemo, useState } from 'react';

interface ILovKildeToRegistreringshjemmel extends IKodeverkValue {
  registreringshjemler: IKodeverkSimpleValue[];
}

interface Props {
  selectedHjemler: string[];
  setSelectedHjemler: (hjemler: string[]) => void;
  options: ILovKildeToRegistreringshjemmel[];
  label: ReactNode;
}

export const SelectHjemler = ({ selectedHjemler, setSelectedHjemler, label, options }: Props) => {
  const [value, setValue] = useState('');
  const filteredOptions = useFilteredOptions(options, value);

  const filteredItems = useMemo(
    () =>
      filteredOptions.map(({ id, navn, registreringshjemler }) => (
        <CheckboxGroup key={id} legend={navn} value={selectedHjemler} onChange={setSelectedHjemler}>
          {registreringshjemler.map((r) => (
            // <Checkbox> renders much faster than <ActionMenu.CheckboxItem>
            <Checkbox size="small" key={r.id} value={r.id}>
              {r.navn}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )),
    [filteredOptions, selectedHjemler, setSelectedHjemler],
  );

  const all = useMemo(
    () => options.flatMap(({ registreringshjemler }) => registreringshjemler.map(({ id }) => id)),
    [options],
  );

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          size="small"
          variant="secondary-neutral"
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition="right"
          className="justify-between!"
        >
          {/* todo: sjekk om det ser fint ut når label er null */}
          {label} ({selectedHjemler.length})
        </Button>
      </ActionMenu.Trigger>

      <ActionMenu.Content className="relative">
        <HStack wrap={false} className="sticky top-0 z-1 bg-ax-bg-default">
          <TextField
            size="small"
            autoFocus
            className="grow"
            placeholder="Filtrer"
            label="Registreringshjemler"
            hideLabel
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button onClick={() => setSelectedHjemler(all)} size="small" variant="secondary" style={{ marginLeft: 8 }}>
            Velg alle
          </Button>

          <Button onClick={() => setSelectedHjemler([])} size="small" variant="danger" style={{ marginLeft: 8 }}>
            Fjern alle
          </Button>
        </HStack>

        <ActionMenu.Divider />

        <VStack gap="2">{filteredItems}</VStack>
      </ActionMenu.Content>
    </ActionMenu>
  );
};

const useFilteredOptions = (
  options: ILovKildeToRegistreringshjemmel[],
  value: string,
): ILovKildeToRegistreringshjemmel[] =>
  useMemo(() => {
    let isFilteredByHjemmel = false;

    const filteredByHjemmel = options
      .map(({ registreringshjemler, ...rest }) => ({
        ...rest,
        registreringshjemler: registreringshjemler.filter(({ navn: label }) => {
          const filtered = label.toLowerCase().includes(value.toLowerCase());

          if (filtered) {
            isFilteredByHjemmel = true;
          }

          return filtered;
        }),
      }))
      .filter(({ registreringshjemler }) => registreringshjemler.length > 0);

    if (isFilteredByHjemmel) {
      return filteredByHjemmel;
    }

    // Filter by lovkilde instead
    return options.filter((option) => option.navn.toLowerCase().includes(value.toLowerCase()));
  }, [options, value]);
