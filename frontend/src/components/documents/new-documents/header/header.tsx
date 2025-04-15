import { DeleteDropArea } from '@app/components/documents/new-documents/header/drop-delete-area';
import { DropZone } from '@app/components/documents/new-documents/header/drop-zone';
import { listHeaderCSS } from '@app/components/documents/styled-components/list-header';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  headingId: string;
}

export const ListHeader = ({ headingId }: Props) => {
  const errorMessage = useValidationError('underArbeid');
  const [isExpanded] = useIsExpanded();

  return (
    <NewDocumentsStyledListHeader>
      <DropZone>
        <Heading size="xsmall" level="2" id={headingId}>
          Dokumenter under arbeid
        </Heading>
        {typeof errorMessage === 'string' ? (
          <ExclamationmarkTriangleIcon title={errorMessage} className="text-text-danger" />
        ) : null}
      </DropZone>
      {isExpanded ? <DeleteDropArea /> : null}
    </NewDocumentsStyledListHeader>
  );
};

const NewDocumentsStyledListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: var(--a-spacing-2);
  ${listHeaderCSS}
`;
