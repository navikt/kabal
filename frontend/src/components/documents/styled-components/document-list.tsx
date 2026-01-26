import { VStack, type VStackProps } from '@navikt/ds-react';

type Props = Omit<VStackProps, 'as' | 'asChild' | 'gap' | 'padding' | 'paddingBlock' | 'overflow' | 'overflowY'>;

export const StyledDocumentList = ({ children, ...props }: Props) => (
  <VStack as="ul" position="relative" gap="space-0 space-4" overflowY="hidden" {...props}>
    {children}
  </VStack>
);
