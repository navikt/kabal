import { css, styled } from 'styled-components';
import { StyledParagraph } from '@app/plate/components/paragraph';

export enum SectionTypeEnum {
  LABEL,
  MALTEKST,
  MALTEKSTSEKSJON,
  REDIGERBAR_MALTEKST,
  REGELVERK,
  SIGNATURE,
  HEADER,
  FOOTER,
}

const FONT_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKSTSEKSJON]: 'inherit',
  [SectionTypeEnum.MALTEKST]: 'var(--a-gray-700)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'inherit',
  [SectionTypeEnum.REGELVERK]: 'inherit',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-700)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-700)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-gray-700)',
  [SectionTypeEnum.LABEL]: 'var(--a-gray-700)',
};

const PRIMARY_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKSTSEKSJON]: 'var(--a-deepblue-300)',
  [SectionTypeEnum.MALTEKST]: 'var(--a-purple-300)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'var(--a-green-100)',
  [SectionTypeEnum.REGELVERK]: 'var(--a-blue-200)',
  [SectionTypeEnum.HEADER]: 'var(--a-gray-300)',
  [SectionTypeEnum.FOOTER]: 'var(--a-gray-300)',
  [SectionTypeEnum.SIGNATURE]: 'var(--a-limegreen-300)',
  [SectionTypeEnum.LABEL]: 'var(--a-gray-200)',
};

const secionToolbarCss = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  background-color: var(--a-bg-subtle);
  padding: 0;
  color: var(--a-icon-action);
  font-size: 12pt;
  box-shadow: var(--a-shadow-medium);

  &:focus {
    opacity: 1;
  }
`;

export const SectionToolbar = styled.div`
  ${secionToolbarCss}
  right: calc(100% + 8px);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

export const MaltekstseksjonToolbar = styled.div`
  ${secionToolbarCss}
  left: calc(100% + 8px);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const sectionBeforeCss = css`
  content: '';
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 0;
  border-style: solid;
  border-color: transparent;
`;

const sectionContainerCss = css`
  position: relative;
  margin-top: 0;
  background-color: transparent;
  user-select: text;

  /* Hide empty paragraph placeholders */
  &[data-element='maltekst'] ${StyledParagraph}::before {
    content: '';
  }
`;

interface SectionContainerProps {
  $sectionType: SectionTypeEnum;
}

export const SectionContainer = styled.div<SectionContainerProps>`
  ${sectionContainerCss}
  color: ${(props) => FONT_COLOR_MAP[props.$sectionType]};

  &::before {
    ${sectionBeforeCss}
    left: -8px;
    transition: border-left-color 0.2s ease-in-out;
    border-left-width: 4px;
  }

  &:hover {
    &::before {
      border-left-color: ${(props) => PRIMARY_COLOR_MAP[props.$sectionType]};
    }

    > ${SectionToolbar} {
      opacity: 1;
    }
  }
`;

export const MaltekstseksjonContainer = styled.div`
  ${sectionContainerCss}
  color:  ${FONT_COLOR_MAP[SectionTypeEnum.MALTEKSTSEKSJON]};

  &::before {
    ${sectionBeforeCss}
    right: -8px;
    transition: border-right-color 0.2s ease-in-out;
    border-right-width: 4px;
  }

  &:hover {
    &::before {
      border-right-color: ${PRIMARY_COLOR_MAP[SectionTypeEnum.MALTEKSTSEKSJON]};
    }

    > ${MaltekstseksjonToolbar} {
      opacity: 1;
    }
  }
`;
