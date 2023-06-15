import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import React from 'react';
import styled from 'styled-components';
import { DeleteDropArea } from '@app/components/documents/new-documents/header/drop-delete-area';
import { DropHeading } from '@app/components/documents/new-documents/header/drop-header';
import { listHeaderCSS } from '@app/components/documents/styled-components/list-header';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useValidationError } from '@app/hooks/use-validation-error';

export const ListHeader = () => {
  const isFullfoert = useIsFullfoert();
  const errorMessage = useValidationError('underArbeid');
  const [isExpanded] = useIsExpanded();

  if (isFullfoert) {
    return null;
  }

  if (typeof errorMessage === 'string') {
    return (
      <NewDocumentsStyledListHeader>
        <DropHeading>
          Dokumenter under arbeid
          <ExclamationmarkTriangleIcon title={errorMessage} color="#ba3a26" />
        </DropHeading>
        {isExpanded ? <DeleteDropArea /> : null}
      </NewDocumentsStyledListHeader>
    );
  }

  return (
    <NewDocumentsStyledListHeader>
      <DropHeading>Dokumenter under arbeid</DropHeading>
      {isExpanded ? <DeleteDropArea /> : null}
    </NewDocumentsStyledListHeader>
  );
};

const NewDocumentsStyledListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
  ${listHeaderCSS}
`;
