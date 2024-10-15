import { NestedFilterList, type NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { isIndeterminate } from '@app/components/smart-editor-texts/hjemler-select/is-indeterminate';
import { Popup } from '@app/components/smart-editor-texts/hjemler-select/popup';
import { GLOBAL, LIST_DELIMITER, NONE_OPTION, WILDCARD } from '@app/components/smart-editor-texts/types';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import { useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
  includeNoneOption?: boolean;
  ytelserSelectable?: boolean;
  ytelseIsWildcard?: boolean;
}

const GENERAL_THRESHOLD = 12;

export const HjemlerSelect = ({
  selected,
  onChange,
  includeNoneOption = false,
  ytelserSelectable = false,
  ytelseIsWildcard = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: ytelser = [] } = useKabalYtelserLatest();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const generelleHjemler = useMemo(() => {
    const lovkildeOptionList: NestedOption[] = [];
    const allHjemler = ytelser
      .flatMap(({ lovKildeToRegistreringshjemler }) =>
        lovKildeToRegistreringshjemler.flatMap(({ registreringshjemler }) => registreringshjemler.map(({ id }) => id)),
      )
      .reduce<string[]>((acc, hjemmel, _, all) => {
        if (acc.includes(hjemmel)) {
          return acc;
        }

        if (all.filter((id) => id === hjemmel).length >= GENERAL_THRESHOLD) {
          acc.push(hjemmel);
        }

        return acc;
      }, []);

    for (const ytelse of ytelser) {
      for (const { navn, id, registreringshjemler } of ytelse.lovKildeToRegistreringshjemler) {
        for (const hjemmel of registreringshjemler) {
          if (allHjemler.includes(hjemmel.id)) {
            const lovkildeId = `${GLOBAL}${LIST_DELIMITER}${id}`;
            const hjemmedOptionId = `${GLOBAL}${LIST_DELIMITER}${hjemmel.id}`;

            const lovkildeOption = lovkildeOptionList.find((o) => o.value === lovkildeId);

            if (lovkildeOption === undefined) {
              lovkildeOptionList.push({
                type: OptionType.GROUP,
                label: navn,
                value: lovkildeId,
                filterValue: navn,
                options: [
                  {
                    type: OptionType.OPTION,
                    value: hjemmedOptionId,
                    label: hjemmel.navn,
                    filterValue: `${navn} ${hjemmel.navn}`,
                  },
                ],
              });
            } else if (lovkildeOption.options === undefined) {
              lovkildeOption.options = [
                {
                  type: OptionType.OPTION,
                  value: hjemmedOptionId,
                  label: hjemmel.navn,
                  filterValue: `${navn} ${hjemmel.navn}`,
                },
              ];
            } else if (lovkildeOption.options.every((o) => o.value !== hjemmedOptionId)) {
              lovkildeOption.options.push({
                type: OptionType.OPTION,
                value: hjemmedOptionId,
                label: hjemmel.navn,
                filterValue: `${navn} ${hjemmel.navn}`,
              });
            }
          }
        }
      }
    }

    return lovkildeOptionList;
  }, [ytelser]);

  const isGlobalSelected = selected.includes(GLOBAL);

  const ytelseOptions: NestedOption[] = useMemo(
    () =>
      ytelser
        .map<NestedOption>(({ id: ytelseId, navn: ytelsenavn, lovKildeToRegistreringshjemler }) => {
          const ytelseValue = ytelseIsWildcard ? `${ytelseId}${LIST_DELIMITER}${WILDCARD}` : ytelseId;
          const indeterminate =
            !(ytelseIsWildcard || selected.includes(ytelseValue)) &&
            (isGlobalSelected ||
              lovKildeToRegistreringshjemler.some(({ registreringshjemler }) =>
                registreringshjemler.some(
                  (h) =>
                    selected.includes(createHjemmelValue(ytelseId, h.id)) || isIndeterminate(selected, h.id, ytelseId),
                ),
              ));

          return {
            type: ytelserSelectable ? OptionType.OPTION : OptionType.GROUP,
            label: ytelsenavn,
            value: ytelseValue,
            indeterminate,
            filterValue: ytelsenavn,
            options: lovKildeToRegistreringshjemler.map<NestedOption>(({ id, navn, registreringshjemler }) => ({
              type: OptionType.GROUP,
              label: navn,
              value: `${ytelseId}${LIST_DELIMITER}${id}`,
              filterValue: `${ytelsenavn} ${navn}`,
              options: registreringshjemler.map<NestedOption>((h) => ({
                type: OptionType.OPTION,
                value: createHjemmelValue(ytelseId, h.id),
                indeterminate: !ytelseIsWildcard && isIndeterminate(selected, h.id, ytelseId),
                label: h.navn,
                filterValue: `${ytelsenavn} ${navn} ${h.navn}`,
              })),
            })),
          };
        })
        .concat([
          {
            type: OptionType.OPTION,
            label: `Hjemler felles for ${GENERAL_THRESHOLD} ytelser`,
            value: GLOBAL,
            filterValue: GLOBAL,
            options: generelleHjemler,
          },
        ]),

    [generelleHjemler, isGlobalSelected, selected, ytelseIsWildcard, ytelser, ytelserSelectable],
  );

  const options = useMemo(
    () =>
      includeNoneOption
        ? [{ ...NONE_OPTION, filterValue: NONE_OPTION.value, type: OptionType.OPTION }, ...ytelseOptions]
        : ytelseOptions,
    [includeNoneOption, ytelseOptions],
  );

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Container ref={ref}>
      <ToggleButton $open={isOpen} onClick={toggleOpen}>
        Ytelser og hjemler ({selected.length})
      </ToggleButton>
      <Popup isOpen={isOpen}>
        <NestedFilterList
          options={options}
          selected={selected}
          onChange={onChange}
          data-testid="edit-text-hjemler-select"
        />
      </Popup>
    </Container>
  );
};

const createHjemmelValue = (ytelseId: string, hjemmelId: string) => `${ytelseId}${LIST_DELIMITER}${hjemmelId}`;

const Container = styled.div`
  position: relative;
`;
