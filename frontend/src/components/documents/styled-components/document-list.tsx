import { VStack, type VStackProps } from '@navikt/ds-react';

type Props = Omit<VStackProps, 'as' | 'asChild' | 'gap' | 'padding' | 'paddingBlock' | 'overflow' | 'overflowY'>;

export const StyledDocumentList = ({ children, ...props }: Props) => (
  <VStack as="ul" position="relative" gap="0 1" overflowY="hidden" {...props}>
    {children}
  </VStack>
);
