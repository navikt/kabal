import { BoxNew, HGrid } from '@navikt/ds-react';
import { useEditorReadOnly } from '@platejs/core/react';
import type { HtmlHTMLAttributes } from 'react';

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
  [SectionTypeEnum.MALTEKST]: 'var(--ax-text-neutral)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'inherit',
  [SectionTypeEnum.REGELVERK]: 'inherit',
  [SectionTypeEnum.HEADER]: 'var(--ax-text-neutral)',
  [SectionTypeEnum.FOOTER]: 'var(--ax-text-neutral)',
  [SectionTypeEnum.SIGNATURE]: 'var(--ax-text-neutral)',
  [SectionTypeEnum.LABEL]: 'var(--ax-text-neutral)',
};

const BORDER_COLOR_MAP: Record<SectionTypeEnum, string> = {
  [SectionTypeEnum.MALTEKSTSEKSJON]: 'var(--ax-border-info)',
  [SectionTypeEnum.MALTEKST]: 'var(--ax-border-meta-purple)',
  [SectionTypeEnum.REDIGERBAR_MALTEKST]: 'var(--ax-border-success)',
  [SectionTypeEnum.REGELVERK]: 'var(--ax-border-accent)',
  [SectionTypeEnum.HEADER]: 'var(--ax-border-neutral)',
  [SectionTypeEnum.FOOTER]: 'var(--ax-border-neutral)',
  [SectionTypeEnum.SIGNATURE]: 'var(--ax-border-meta-lime)',
  [SectionTypeEnum.LABEL]: 'var(--ax-border-neutral)',
};

const BaseToolbarStyle = ({ style, className, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) => (
  <BoxNew
    position="absolute"
    top="0"
    bottom="0"
    {...rest}
    style={style}
    className={`text-[12pt] opacity-0 transition-opacity duration-200 focus:opacity-100 ${className}`}
  />
);

const SectionToolbarStyle = ({ style, className, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) => (
  <BaseToolbarStyle
    {...rest}
    style={{ right: 'calc(100% + var(--ax-space-8))', ...style }}
    className={`rounded-l-sm group-hover/section:opacity-100 ${className}`}
  />
);

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

export const MaltekstseksjonToolbarStyle = ({ style, className, ...rest }: HtmlHTMLAttributes<HTMLDivElement>) => (
  <BaseToolbarStyle
    {...rest}
    style={{ left: 'calc(100% + var(--ax-space-8))', ...style }}
    className={`rounded-r-sm group-hover/maltekst:opacity-100 ${className}`}
  />
);

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

interface StickyContentProps {
  children: React.ReactNode;
}

const StickyContent = ({ children }: StickyContentProps) => (
  <HGrid asChild position="sticky" columns="auto auto" top="space-48" gap="space-4">
    <BoxNew background="sunken" shadow="dialog" className="text-ax-text-accent">
      {children}
    </BoxNew>
  </HGrid>
);

interface BaseSectionContainerProps extends HtmlHTMLAttributes<HTMLDivElement> {
  color: string;
  borderColor: string;
}

const BaseSectionContainer = ({
  color,
  borderColor,
  className,
  style,
  children,
  ...rest
}: BaseSectionContainerProps) => (
  <BoxNew
    position="relative"
    style={{ color: color, ['--border-color' as string]: borderColor, ...style }}
    className={`select-none before:absolute before:top-0 before:bottom-0 before:block before:border-transparent hover:z-1 hover:before:border-(--border-color) ${className}`}
    {...rest}
  >
    {children}
  </BoxNew>
);

interface SectionContainerProps extends HtmlHTMLAttributes<HTMLDivElement> {
  sectionType: SectionTypeEnum;
}

export const SectionContainer = ({ sectionType, children, ...rest }: SectionContainerProps) => (
  <BaseSectionContainer
    color={FONT_COLOR_MAP[sectionType]}
    borderColor={BORDER_COLOR_MAP[sectionType]}
    className="group/section before:-left-2 before:border-l-4"
    {...rest}
  >
    {children}
  </BaseSectionContainer>
);

export const MaltekstseksjonContainer = (props: HtmlHTMLAttributes<HTMLDivElement>) => (
  <BaseSectionContainer
    color={FONT_COLOR_MAP[SectionTypeEnum.MALTEKSTSEKSJON]}
    borderColor={BORDER_COLOR_MAP[SectionTypeEnum.MALTEKSTSEKSJON]}
    className="group/maltekst before:-right-2 before:border-l-4 [&>p:before]:content-['']"
    {...props}
  />
);
