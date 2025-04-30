import { Fields } from '@app/components/documents/new-documents/grid';
import { HStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const StyledDocumentTitle = ({ children, className }: Props) => (
  <HStack
    as="h1"
    gap="2"
    overflow="hidden"
    wrap={false}
    height="100%"
    minWidth="100px"
    align="center"
    style={{ gridArea: Fields.Title }}
    className={`group text-large ${className}`}
  >
    {children}
  </HStack>
);
