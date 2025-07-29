import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { HStack } from '@navikt/ds-react';

export const DocumentTitleContainer = ({
  children,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  <HStack
    {...props}
    as="h1"
    align="center"
    gap="2"
    overflow="hidden"
    height="100%"
    margin="0"
    wrap={false}
    className="group overflow-hidden whitespace-nowrap font-normal text-ax-large"
    style={{ gridArea: Fields.Title }}
  >
    {children}
  </HStack>
);
