import { DeleteDropArea } from '@app/components/documents/new-documents/header/delete-drop-area';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { HStack, Heading } from '@navikt/ds-react';

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
      gap="2"
      paddingBlock="0 2"
      flexGrow="1"
      wrap={false}
      className="border-border-divider border-b"
    >
      <Heading size="xsmall" level="2" id={headingId}>
        Dokumenter under arbeid
      </Heading>
      {typeof errorMessage === 'string' ? (
        <ExclamationmarkTriangleIcon title={errorMessage} className="text-text-danger" />
      ) : null}
      {isExpanded ? <DeleteDropArea /> : null}
    </HStack>
  );
};
