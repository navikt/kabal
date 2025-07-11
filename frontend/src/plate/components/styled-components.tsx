import { useEditorReadOnly } from '@platejs/core/react';
import type { HtmlHTMLAttributes } from 'react';
import { css, styled } from 'styled-components';

export enum SectionTypeEnum {
  LABEL = 0,
  MALTEKST = 1,
  MALTEKSTSEKSJON = 2,
  REDIGERBAR_MALTEKST = 3,
  REGELVERK = 4,
  SIGNATURE = 5,
  HEADER = 6,
  FOOTER = 7,
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

const sectionToolbarCss = css`
  position: absolute;
  top: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  padding: 0;
  font-size: 12pt;

  &:focus {
    opacity: 1;
  }
`;

const SectionToolbarStyle = styled.div`
  ${sectionToolbarCss}
  right: calc(100% + var(--a-spacing-2));
  border-top-left-radius: var(--a-spacing-1);
  border-bottom-left-radius: var(--a-spacing-1);
`;

export const SectionToolbar = ({ children, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) => {
  if (useEditorReadOnly()) {
    return null;
  }

  return (
    <SectionToolbarStyle {...rest}>
      <StickyContent>{children}</StickyContent>
    </SectionToolbarStyle>
  );
};

export const MaltekstseksjonToolbarStyle = styled.div`
  ${sectionToolbarCss}
  left: calc(100% + var(--a-spacing-2));
  border-top-right-radius: var(--a-spacing-1);
  border-bottom-right-radius: var(--a-spacing-1);
`;

export const MaltekstseksjonToolbar = ({ children, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) => {
  if (useEditorReadOnly()) {
    return null;
  }

  return (
    <MaltekstseksjonToolbarStyle {...rest}>
      <StickyContent>{children}</StickyContent>
    </MaltekstseksjonToolbarStyle>
  );
};

const StickyContent = styled.div`
  position: sticky;
  top: var(--a-spacing-12);
  display: grid;
  grid-template-columns: auto auto;
  flex-direction: row;
  gap: var(--a-spacing-1);
  background-color: var(--a-bg-subtle);
  color: var(--a-icon-action);
  box-shadow: var(--a-shadow-medium);
`;

const sectionBeforeCss = css`
  content: '';
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  border-style: solid;
  border-color: transparent;
`;

const sectionContainerCss = css`
  position: relative;
  margin-top: 0;
  background-color: transparent;
  user-select: text;

  /* Hide empty paragraph placeholders */
  &[data-element='maltekst'] p::before {
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
    border-left-width: var(--a-spacing-1);
  }

  &:hover {
    &::before {
      border-left-color: ${(props) => PRIMARY_COLOR_MAP[props.$sectionType]};
    }

    > ${SectionToolbarStyle} {
      opacity: 1;
    }

    z-index: 1;
  }
`;

export const MaltekstseksjonContainer = styled.div`
  ${sectionContainerCss}
  color:  ${FONT_COLOR_MAP[SectionTypeEnum.MALTEKSTSEKSJON]};

  &::before {
    ${sectionBeforeCss}
    right: -8px;
    transition: border-right-color 0.2s ease-in-out;
    border-right-width: var(--a-spacing-1);
  }

  &:hover {
    &::before {
      border-right-color: ${PRIMARY_COLOR_MAP[SectionTypeEnum.MALTEKSTSEKSJON]};
    }

    > ${MaltekstseksjonToolbarStyle} {
      opacity: 1;
    }

    z-index: 1;
  }
`;
