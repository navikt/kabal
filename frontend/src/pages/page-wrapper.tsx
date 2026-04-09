import { Box, Heading, VStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => <main className="w-full grow overflow-auto p-4">{children}</main>;

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export const OppgaverPageWrapper = ({ children, title }: OppgaverPageWrapperProps): React.JSX.Element => (
  <VStack flexGrow="1" width="100%" overflow="hidden">
    {title === undefined ? null : (
      <Box as={Heading} level="1" size="medium" padding="space-16" borderWidth="0 0 1 0" borderColor="neutral">
        {title}
      </Box>
    )}

    <VStack gap="space-64 space-0" overflow="auto" width="100%" flexGrow="1" padding="space-16">
      {children}
    </VStack>
  </VStack>
);
