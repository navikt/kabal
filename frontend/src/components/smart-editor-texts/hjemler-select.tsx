/* eslint-disable max-depth */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { NestedFilterList, NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { GLOBAL, LIST_DELIMITER, NONE_OPTION } from '@app/components/smart-editor-texts/types';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import { ToggleButton } from '../toggle-button/toggle-button';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
  includeNoneOption?: boolean;
}

const GENERAL_THRESHOLD = 12;

export const HjemlerSelect = ({ selected, onChange, includeNoneOption = false }: Props) => {
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

  const ytelseOptions: NestedOption[] = useMemo(
    () =>
      ytelser
        .map<NestedOption>(({ id: ytelseId, navn: ytelsenavn, lovKildeToRegistreringshjemler }) => ({
          type: OptionType.OPTION,
          label: ytelsenavn,
          value: ytelseId,
          filterValue: ytelsenavn,
          options: lovKildeToRegistreringshjemler.map(({ id, navn, registreringshjemler }) => ({
            type: OptionType.GROUP,
            label: navn,
            value: `${ytelseId}${LIST_DELIMITER}${id}`,
            filterValue: `${ytelsenavn} ${navn}`,
            options: registreringshjemler.map((h) => ({
              type: OptionType.OPTION,
              value: `${ytelseId}${LIST_DELIMITER}${h.id}`,
              label: h.navn,
              filterValue: `${ytelsenavn} ${navn} ${h.navn}`,
            })),
          })),
        }))
        .concat([
          {
            type: OptionType.OPTION,
            label: `Hjemler felles for ${GENERAL_THRESHOLD} ytelser`,
            value: GLOBAL,
            filterValue: GLOBAL,
            options: generelleHjemler,
          },
        ]),

    [generelleHjemler, ytelser],
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

const Container = styled.div`
  position: relative;
`;

interface PopupProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Popup = ({ isOpen, children }: PopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return <StyledPopup>{children}</StyledPopup>;
};

const StyledPopup = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  max-height: 400px;
  max-width: 275px;
  scroll-margin-bottom: 16px;
  z-index: 22;

  background-color: white;
  border-radius: var(--a-border-radius-medium);
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
