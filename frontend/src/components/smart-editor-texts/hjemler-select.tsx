import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { NONE_OPTION } from '@app/components/smart-editor-texts/types';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useLovkildeToRegistreringshjemlerLatest } from '@app/simple-api-state/use-kodeverk';
import { GroupedFilterList, OptionGroup } from '../filter-dropdown/grouped-filter-list';
import { ToggleButton } from '../toggle-button/toggle-button';

interface Props {
  selected: string[] | undefined;
  onChange: (selected: string[]) => void;
  includeNoneOption?: boolean;
}

export const HjemlerSelect = ({ selected = [], onChange, includeNoneOption = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data = [] } = useLovkildeToRegistreringshjemlerLatest();

  const options = useMemo<OptionGroup<string>[]>(() => {
    const hjemler = data.map(({ id, navn, registreringshjemler }) => ({
      sectionHeader: { id, name: navn },
      sectionOptions: registreringshjemler.map((h) => ({ value: h.id, label: h.navn })),
    }));

    if (!includeNoneOption) {
      return hjemler;
    }

    return [{ sectionHeader: { id: 'NONE' }, sectionOptions: [NONE_OPTION] }, ...hjemler];
  }, [data, includeNoneOption]);

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
  useOnClickOutside(ref, close);

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
  z-index: 3;

  background-color: white;
  border-radius: 4px;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
