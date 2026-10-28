import { HStack } from '@navikt/ds-react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';

export const DocumentTitleContainer = ({
  children,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  <HStack
    {...props}
    as="h1"
    align="center"
    gap="space-8"
    overflow="hidden"
    height="100%"
    margin="space-0"
    wrap={false}
    className="group text-ax-large overflow-hidden font-normal whitespace-nowrap"
    style={{ gridArea: Fields.Title }}
  >
    {children}
  </HStack>
);
