import { BoxNew, Heading, VStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: Props) => <main className="w-full grow overflow-auto p-4">{children}</main>;

interface OppgaverPageWrapperProps {
  children: React.ReactNode;
  title?: string;
  testId?: string;
}

export const OppgaverPageWrapper = ({ children, title, testId }: OppgaverPageWrapperProps): React.JSX.Element => (
  <VStack flexGrow="1" width="100%" overflow="hidden" data-testid={`${testId}-container`}>
    {title === undefined ? null : (
      <BoxNew as={Heading} level="1" size="medium" data-testid={`${testId}-title`} padding="4" shadow="dialog">
        {title}
      </BoxNew>
    )}

    <VStack gap="16 0" overflow="auto" width="100%" flexGrow="1" padding="4" data-testid={testId}>
      {children}
    </VStack>
  </VStack>
);
