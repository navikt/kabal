import { DeleteDropArea } from '@app/components/documents/new-documents/header/drop-delete-area';
import { DropHeading } from '@app/components/documents/new-documents/header/drop-header';
import { listHeaderCSS } from '@app/components/documents/styled-components/list-header';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useValidationError } from '@app/hooks/use-validation-error';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { styled } from 'styled-components';

export const ListHeader = () => {
  const errorMessage = useValidationError('underArbeid');
  const [isExpanded] = useIsExpanded();

  return (
    <NewDocumentsStyledListHeader>
      <DropHeading>
        Dokumenter under arbeid
        {typeof errorMessage === 'string' ? (
          <ExclamationmarkTriangleIcon title={errorMessage} color="var(--a-text-danger)" />
        ) : null}
      </DropHeading>
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
