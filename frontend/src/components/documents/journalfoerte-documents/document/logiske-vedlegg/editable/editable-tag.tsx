import { merge } from '@app/functions/classes';
import { HStack, Tag, type TagProps } from '@navikt/ds-react';

export const EditableTag = ({ children, className, ...rest }: TagProps & React.RefAttributes<HTMLSpanElement>) => (
  <HStack
    as={Tag}
    gap="space-0 space-4"
    wrap={false}
    overflow="hidden"
    position="relative"
    paddingInline="space-8"
    justify="start"
    maxWidth="100%"
    className={merge('truncate rounded-xl text-left', className)}
    {...rest}
  >
    {children}
  </HStack>
);
