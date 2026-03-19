import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Heading, HStack } from '@navikt/ds-react';
import { DeleteDropArea } from '@/components/documents/new-documents/header/delete-drop-area';
import { useIsExpanded } from '@/components/documents/use-is-expanded';
import { useValidationError } from '@/hooks/use-validation-error';

interface Props {
  headingId: string;
}

export const NewDocumentsHeader = ({ headingId }: Props) => {
  const errorMessage = useValidationError('underArbeid');
  const [isExpanded] = useIsExpanded();

  return (
    <HStack
      as="header"
      justify="space-between"
      align="center"
      gap="space-8"
      paddingBlock="space-0 space-8"
      flexGrow="1"
      wrap={false}
      className="border-ax-border-neutral border-b"
    >
      <Heading size="xsmall" level="2" id={headingId}>
        Dokumenter under arbeid
      </Heading>
      {typeof errorMessage === 'string' ? (
        <ExclamationmarkTriangleIcon title={errorMessage} className="text-ax-text-danger-decoration" />
      ) : null}
      {isExpanded ? <DeleteDropArea /> : null}
    </HStack>
  );
};
