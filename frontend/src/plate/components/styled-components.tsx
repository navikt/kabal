import { styled } from 'styled-components';
import { StyledParagraph } from '@app/plate/components/paragraph';
import { StyledPageBreak } from './page-break';

export enum SectionTypeEnum {
  LABEL,
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
  [SectionTypeEnum.LABEL]: 'var(--a-gray-700)',
};

const PRIMARY_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKST]: 'var(--a-purple-300)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'var(--a-green-100)',
  [SectionTypeEnum.REGELVERK]: 'var(--a-blue-200)',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-300)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-300)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-limegreen-300)',
  [SectionTypeEnum.LABEL]: 'var(--a-gray-200)',
};

export const SectionToolbar = styled.div`
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  background-color: var(--a-bg-subtle);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 0;
  color: var(--a-icon-action);
  font-size: 12pt;
  box-shadow: var(--a-shadow-medium);

  &:focus {
    opacity: 1;
  }
`;

interface SectionContainerProps {
  $sectionType: SectionTypeEnum;
}

export const SectionContainer = styled.div<SectionContainerProps>`
  position: relative;
  margin-top: 0;
  /* z-index: 0; */
  background-color: transparent;
  user-select: text;
  color: ${(props) => FONT_COLOR_MAP[props.$sectionType]};

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -8px;
    z-index: 0;
    transition: border-left-color 0.2s ease-in-out;
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: transparent;
  }

  &:hover {
    &::before {
      border-left-color: ${(props) => PRIMARY_COLOR_MAP[props.$sectionType]};
    }

    > ${SectionToolbar} {
      opacity: 1;
    }
  }

  > ${StyledPageBreak} {
    z-index: -1;
  }

  /* Hide empty paragraph placeholders */
  &[data-element='maltekst'] ${StyledParagraph}::before {
    content: '';
  }
`;
