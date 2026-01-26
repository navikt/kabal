import { Header, Trigger } from '@app/components/filter-dropdown/multi-select-dropdown';
import type { IKodeverkSimpleValue, IKodeverkValue } from '@app/types/kodeverk';
import { ActionMenu, type ButtonProps, Checkbox, CheckboxGroup, VStack } from '@navikt/ds-react';
import { type ReactNode, useMemo, useState } from 'react';

interface ILovKildeToRegistreringshjemmel extends IKodeverkValue {
  registreringshjemler: IKodeverkSimpleValue[];
}

interface Props {
  selectedHjemler: string[];
  setSelectedHjemler: (hjemler: string[]) => void;
  options: ILovKildeToRegistreringshjemmel[];
  label: ReactNode;
  variant?: ButtonProps['variant'];
}

export const SelectHjemler = ({
  selectedHjemler,
  setSelectedHjemler,
  label,
  options,
  variant = 'secondary-neutral',
}: Props) => {
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
      <Trigger variant={variant}>
        {label} ({selectedHjemler.length})
      </Trigger>

      <ActionMenu.Content className="relative">
        <Header
          label="Registreringshjemler"
          value={value}
          setValue={setValue}
          onChange={setSelectedHjemler}
          allOptions={all}
        />

        <ActionMenu.Divider />

        <VStack gap="space-8">{filteredItems}</VStack>
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
