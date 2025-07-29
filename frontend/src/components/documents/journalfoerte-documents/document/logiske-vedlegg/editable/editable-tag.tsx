import { merge } from '@app/functions/classes';
import { HStack, Tag, type TagProps } from '@navikt/ds-react';

export const EditableTag = ({ children, className, ...rest }: TagProps & React.RefAttributes<HTMLSpanElement>) => (
  <HStack
    as={Tag}
    gap="0 1"
    wrap={false}
    overflow="hidden"
    position="relative"
    paddingInline="2"
    justify="start"
    maxWidth="100%"
    className={merge('truncate rounded-xlarge text-left', className)}
    {...rest}
  >
    {children}
  </HStack>
);
