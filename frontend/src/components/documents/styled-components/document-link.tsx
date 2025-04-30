import { HStack } from '@navikt/ds-react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
}

export const DocumentLink = ({ active = false, disabled = false, children, href, ...rest }: Props) => {
  if (disabled) {
    return (
      <span className={DISABLED_CLASSES} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <HStack
      asChild
      gap="2"
      align="center"
      overflow="hidden"
      height="100%"
      className={active ? ACTIVE_CLASSES : INACTIVE_CLASSES}
    >
      <a {...rest} href={href}>
        {children}
      </a>
    </HStack>
  );
};

const INACTIVE_CLASSES = 'cursor-pointer text-text-action hover:text-text-action-hover visited:text-text-visited';
const ACTIVE_CLASSES =
  'cursor-pointer text-text-action-selected text-shadow-[0_0_1px] text-shadow-text-action-selected visited:text-text-action-selected';
const DISABLED_CLASSES = 'text-text-subtle cursor-not-allowed opacity-50';

interface EllipsisTitleProps {
  children: React.ReactNode;
  title?: string;
}

export const EllipsisTitle = ({ children, ...rest }: EllipsisTitleProps) => (
  <span {...rest} className="overflow-hidden text-ellipsis">
    {children}
  </span>
);
