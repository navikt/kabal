import { Dropdown } from '@navikt/ds-react';
import React, { forwardRef, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useScaleState } from '@app/components/smart-editor/hooks/use-scale';
import { SMART_EDITOR_CONTEXT_MENU_EVENT_TYPE, useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { pxToEm } from '@app/plate/components/get-scaled-em';

export enum SectionTypeEnum {
  LABEL,
  MALTEKST,
  REDIGERBAR_MALTEKST,
  REGELVERK,
  SIGNATURE,
  HEADER,
  FOOTER,
}

interface Props {
  children: React.ReactNode;
  sectionType: SectionTypeEnum;
  menu?: {
    title: string;
    items: React.ReactNode;
  };
  'data-element'?: string;
  'data-section'?: string;
}

const MENU_WIDTH = 237;

export const SectionContainer = forwardRef<HTMLDivElement, Props>(({ children, sectionType, menu, ...attrs }, ref) => {
  const { value: scale } = useScaleState();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [{ left, top }, setPosition] = useState({ left: 0, top: 0 });
  useOnClickOutside(contextMenuRef, () => setIsOpen(false));

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    e.target.dispatchEvent(new Event(SMART_EDITOR_CONTEXT_MENU_EVENT_TYPE, { bubbles: true }));

    if (containerRef.current === null) {
      return;
    }

    const { x, y, width } = containerRef.current.getBoundingClientRect();
    const leftPos = e.clientX - x;
    const scaledMenuWidth = MENU_WIDTH * (scale / 100);
    const newLeft = leftPos + scaledMenuWidth > width ? leftPos - scaledMenuWidth : leftPos;
    setPosition({ left: newLeft, top: e.clientY - y });
    setIsOpen(true);
  };

  const setRef = (element: HTMLDivElement) => {
    containerRef.current = element;

    if (typeof ref === 'function') {
      ref(element);
    } else if (ref !== null) {
      ref.current = element;
    }
  };

  return (
    <Container
      $isSelected={isOpen}
      $sectionType={sectionType}
      ref={setRef}
      onContextMenu={onContextMenu}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      {...attrs}
    >
      {children}

      {isOpen && menu !== undefined ? (
        <ContextMenu ref={contextMenuRef} style={{ left, top }} contentEditable={false}>
          <Dropdown.Menu.GroupedList onClick={() => setIsOpen(false)} style={{ width: '100%' }}>
            <Dropdown.Menu.GroupedList.Heading>{menu.title}</Dropdown.Menu.GroupedList.Heading>
            {menu.items}
          </Dropdown.Menu.GroupedList>
        </ContextMenu>
      ) : null}
    </Container>
  );
});

SectionContainer.displayName = 'SectionContainer';

const ContextMenu = styled.section`
  position: absolute;
  background-color: var(--a-surface-default);
  border: 1px solid var(--a-border-default);
  box-shadow: var(--a-shadow-medium);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  z-index: 15;
  white-space: nowrap;
  border-radius: var(--a-border-radius-large);
  padding-top: var(--a-spacing-2);
  padding-bottom: var(--a-spacing-2);
  min-width: ${pxToEm(MENU_WIDTH)};
`;

interface SectionContainerProps {
  $isSelected: boolean;
  $sectionType: SectionTypeEnum;
}

const Container = styled.div<SectionContainerProps>`
  position: relative;
  margin-top: 0;
  background-color: transparent;
  user-select: text;

  color: ${(props) => FONT_COLOR_MAP[props.$sectionType]};

  outline-width: 1px;
  outline-style: solid;
  outline-color: ${(props) => (props.$isSelected ? PRIMARY_COLOR_MAP[props.$sectionType] : 'transparent')};
  transition: outline-color 0.2s ease-in-out;

  border-radius: var(--a-border-radius-medium);
`;

const FONT_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKST]: 'var(--a-gray-700)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'inherit',
  [SectionTypeEnum.REGELVERK]: 'inherit',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-700)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-700)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-gray-700)',
  [SectionTypeEnum.LABEL]: 'var(--a-gray-700)',
};

const PRIMARY_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKST]: 'var(--a-purple-500)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'var(--a-green-500)',
  [SectionTypeEnum.REGELVERK]: 'var(--a-blue-500)',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-500)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-500)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-limegreen-800)',
  [SectionTypeEnum.LABEL]: 'var(--a-gray-500)',
};
