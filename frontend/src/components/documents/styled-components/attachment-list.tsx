import { merge } from '@app/functions/classes';
import { Box } from '@navikt/ds-react';

export const StyledAttachmentListItem = ({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) => (
  <Box
    as="li"
    borderRadius="4"
    position="absolute"
    left="space-0"
    right="space-0"
    paddingInline="space-16 space-0"
    className={merge(
      'before:absolute before:top-4 before:left-0 before:block before:w-3 before:border-ax-border-neutral-subtle before:border-b',
      className,
    )}
    {...rest}
  >
    {children}
  </Box>
);

interface LogiskeVedleggListItemStyleProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'className'> {
  connected: boolean;
}

export const LogiskeVedleggListItemStyle = ({ connected, children, ...rest }: LogiskeVedleggListItemStyleProps) => {
  const bottomClassname = connected ? 'before:bottom-0' : 'before:bottom-[11px]';

  return (
    <li className={`absolute right-0 left-0 flex pl-4 ${BEFORE_CLASSES} ${bottomClassname} ${AFTER_CLASSES}`} {...rest}>
      {children}
    </li>
  );
};

const BEFORE_CLASSES =
  'before:top-[-4px] before:absolute before:left-0 before:w-3 before:border-ax-border-neutral-subtle before:border-l';
const AFTER_CLASSES =
  'after:absolute after:left-[1px] after:top-3 after:h-[1px] after:w-3 after:bg-ax-border-neutral-subtle';
