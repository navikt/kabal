import { BoxNew, HStack } from '@navikt/ds-react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const DocumentLink = ({ active = false, disabled = false, children, icon, href, ...rest }: Props) => {
  if (disabled) {
    return (
      <EllipsisTitle className="cursor-not-allowed text-ax-text-neutral opacity-50" {...rest}>
        {children}
      </EllipsisTitle>
    );
  }

  return (
    <HStack
      asChild
      gap="2"
      align="center"
      overflow="hidden"
      height="100%"
      wrap={false}
      className={active ? ACTIVE_CLASSES : INACTIVE_CLASSES}
    >
      <BoxNew asChild overflow="hidden" borderRadius="medium" paddingInline="05 1">
        <a {...rest} href={href} className="h-fit cursor-pointer self-center text-ax-text-accent-subtle">
          {icon}
          <EllipsisTitle>{children}</EllipsisTitle>
        </a>
      </BoxNew>
    </HStack>
  );
};

const INACTIVE_CLASSES =
  'hover:bg-ax-bg-accent-moderate hover:text-ax-text-accent visited:text-ax-text-meta-purple-subtle visited:hover:text-ax-text-meta-purple';
const ACTIVE_CLASSES = 'bg-ax-bg-accent-moderate text-ax-text-accent';

interface EllipsisTitleProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const EllipsisTitle = ({ children, className, ...rest }: EllipsisTitleProps) => (
  <span {...rest} className={`w-full truncate font-normal ${className}`}>
    {children}
  </span>
);
