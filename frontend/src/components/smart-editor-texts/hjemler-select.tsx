import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { IKodeverkSimpleValue, IKodeverkValue, ILovKildeToRegistreringshjemmel, IYtelse } from '../../types/kodeverk';
import { GroupedFilterList, OptionGroup } from '../filter-dropdown/grouped-filter-list';
import { ToggleButton } from '../toggle-button/toggle-button';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const EMPTY_ARRAY: IYtelse[] = [];

export const HjemlerSelect = ({ selected, onChange }: Props) => {
  const ytelser = useKodeverkValue('ytelser');
  const [isOpen, setIsOpen] = useState(false);

  const lovKildeToRegistreringshjemler = useMergedLovKildeToRegistreringshjemler(ytelser ?? EMPTY_ARRAY);

  const options = useMemo<OptionGroup<string>[]>(
    () =>
      lovKildeToRegistreringshjemler.map(({ lovkilde, registreringshjemler }) => ({
        sectionHeader: { id: lovkilde.id, name: lovkilde.navn },
        sectionOptions: registreringshjemler.map(({ id, label }) => ({ value: id, label })),
      })),
    [lovKildeToRegistreringshjemler]
  );

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Container>
      <ToggleButton $open={isOpen} onClick={toggleOpen}>
        Hjemler ({selected.length})
      </ToggleButton>
      <Popup isOpen={isOpen} close={() => setIsOpen(false)}>
        <GroupedFilterList
          options={options}
          selected={selected}
          onChange={onChange}
          open={isOpen}
          close={() => setIsOpen(false)}
          testType="hjemler"
          showFjernAlle
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
  close: () => void;
}

const Popup = ({ isOpen, close, children }: PopupProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(close, ref);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return <StyledPopup ref={ref}>{children}</StyledPopup>;
};

const StyledPopup = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  max-height: 400px;
  max-width: 275px;
  scroll-margin-bottom: 16px;
  z-index: 2;

  background-color: white;
  border-radius: 4px;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;

interface FilterType {
  id: string;
  label: string;
}

interface MergedRegistreringshjemmel extends Omit<ILovKildeToRegistreringshjemmel, 'registreringshjemler'> {
  registreringshjemler: FilterType[];
}

const useMergedLovKildeToRegistreringshjemler = (ytelser: IYtelse[]): MergedRegistreringshjemmel[] =>
  useMemo(() => {
    const lovKilderToRegistreringshjemlerMap = ytelser
      .flatMap(({ lovKildeToRegistreringshjemler }) => lovKildeToRegistreringshjemler)
      .reduce((lovkildeToRegistreringshjemler, { lovkilde, registreringshjemler }) => {
        const existingLovkildeToRegistreringshjemmel = lovkildeToRegistreringshjemler.get(lovkilde.id);

        const registreringshjemmelMap = new Map<string, IKodeverkSimpleValue>();

        if (typeof existingLovkildeToRegistreringshjemmel === 'undefined') {
          registreringshjemler.forEach((registreringshjemmel) => {
            registreringshjemmelMap.set(registreringshjemmel.id, registreringshjemmel);
          });

          lovkildeToRegistreringshjemler.set(lovkilde.id, { lovkilde, registreringshjemmelMap });
        } else {
          registreringshjemler.forEach((registreringshjemmel) => {
            existingLovkildeToRegistreringshjemmel.registreringshjemmelMap.set(
              registreringshjemmel.id,
              registreringshjemmel
            );
          });
        }

        return lovkildeToRegistreringshjemler;
      }, new Map<string, { lovkilde: IKodeverkValue; registreringshjemmelMap: Map<string, IKodeverkSimpleValue> }>());

    return Array.from(lovKilderToRegistreringshjemlerMap.values())
      .map(({ lovkilde, registreringshjemmelMap }) => ({
        lovkilde,
        registreringshjemler: Array.from(registreringshjemmelMap.values())
          .map(({ id, navn }) => ({ id, label: navn }))
          .sort((a, b) => Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10)),
      }))
      .sort((a, b) => Number.parseInt(a.lovkilde.id, 10) - Number.parseInt(b.lovkilde.id, 10));
  }, [ytelser]);
