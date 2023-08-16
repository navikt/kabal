import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { StyledParagraph } from '@app/plate/components/paragraph';
import { StyledPageBreak } from './page-break';

export enum SectionTypeEnum {
  MALTEKST,
  REDIGERBAR_MALTEKST,
  REGELVERK,
  SIGNATURE,
  HEADER,
  FOOTER,
}

const FONT_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKST]: 'var(--a-gray-700)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'inherit',
  [SectionTypeEnum.REGELVERK]: 'inherit',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-700)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-700)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-gray-700)',
};

const PRIMARY_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKST]: 'var(--a-purple-500)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'var(--a-green-500)',
  [SectionTypeEnum.REGELVERK]: 'var(--a-blue-500)',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-500)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-500)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-limegreen-800)',
};

interface SectionToolbarProps {
  $label: string;
  $sectionType: SectionTypeEnum;
}

export const SectionToolbar = styled.div<SectionToolbarProps>`
  position: absolute;
  right: -1px;
  bottom: 100%;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  background-color: white;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  background-color: ${(props) => PRIMARY_COLOR_MAP[props.$sectionType]};
  padding: 4px;
  color: white;

  &:focus {
    opacity: 1;
  }

  &::after {
    content: '${(props) => props.$label}';
    color: white;
    padding-left: 4px;
  }
`;

export const StyledSectionToolbarButton = styled(Button)`
  color: white;
`;

interface SectionContainerProps {
  $isSelected: boolean;
  $sectionType: SectionTypeEnum;
}

export const SectionContainer = styled.div<SectionContainerProps>`
  position: relative;
  margin-top: 0;
  z-index: 0;
  background-color: transparent;
  user-select: text;

  color: ${(props) => FONT_COLOR_MAP[props.$sectionType]};

  outline-width: 1px;
  outline-style: solid;
  outline-color: ${(props) => (props.$isSelected ? PRIMARY_COLOR_MAP[props.$sectionType] : 'transparent')};
  transition: outline-color 0.2s ease-in-out;

  border-radius: 4px;
  border-top-right-radius: 0;

  > ${SectionToolbar} {
    opacity: ${(props) => (props.$isSelected ? 1 : 0)};
  }

  &:hover {
    outline-color: ${(props) => PRIMARY_COLOR_MAP[props.$sectionType]};

    > ${SectionToolbar} {
      opacity: 1;
    }
  }

  > ${StyledPageBreak} {
    z-index: -1;
  }

  &[data-element='maltekst'] ${StyledParagraph}::before {
    content: '';
  }
`;
