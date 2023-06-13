import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { DeleteDropArea } from '@app/components/documents/expanded/new/drop-delete-area';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DragAndDropTypesEnum } from '@app/types/drag-and-drop';
import { StyledDocumentsContainer } from '../styled-components/container';
import { StyledDocumentList } from '../styled-components/document-list';
import { NewDocumentsStyledListHeader } from '../styled-components/list-header';
import { NewParentDocument } from './new-parent-document';

export const NewDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const isFullfoert = useIsFullfoert();
  const [setParent] = useSetParentMutation();
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dragEnterCount = useRef(0);

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current += 1;

      if (e.dataTransfer.types.includes(DragAndDropTypesEnum.DOCUMENT)) {
        const dokumentId = e.dataTransfer.getData(DragAndDropTypesEnum.DOCUMENT);

        const isAlreadyParent = data?.some(({ id, parentId }) => id === dokumentId && parentId === null) ?? false;

        setIsActive(!isAlreadyParent);

        return;
      }

      setIsActive(false);
    },
    [data]
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsActive(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (e.defaultPrevented) {
        setIsDragging(false);

        return;
      }

      e.preventDefault();

      dragEnterCount.current = 0;

      setIsActive(false);

      if (oppgaveId === skipToken) {
        return;
      }

      if (e.dataTransfer.types.includes(DragAndDropTypesEnum.DOCUMENT)) {
        const dokumentId = e.dataTransfer.getData(DragAndDropTypesEnum.DOCUMENT);

        const isAlreadyParent = data?.some(({ id, parentId }) => id === dokumentId && parentId === null) ?? false;

        if (isAlreadyParent) {
          return;
        }

        setParent({
          dokumentId,
          oppgaveId,
          parentId: null,
        });
      }
    },
    [data, oppgaveId, setParent]
  );

  if (isLoading || typeof data === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const documents = data.filter(({ parentId }) => parentId === null);

  if (documents.length === 0) {
    return null;
  }

  return (
    <StyledDocumentsContainer
      data-testid="new-documents-section"
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
    >
      <ListHeader isFullfoert={isFullfoert} isDragOver={isDragging} />
      <StyledDocumentList data-testid="new-documents-list" $isActive={isActive}>
        {documents.map((document) => (
          <NewParentDocument document={document} key={document.id} />
        ))}
      </StyledDocumentList>
    </StyledDocumentsContainer>
  );
};

interface ListHeaderProps {
  isFullfoert: boolean;
  isDragOver: boolean;
}

const ListHeader = ({ isFullfoert, isDragOver }: ListHeaderProps) => {
  const errorMessage = useValidationError('underArbeid');

  if (isFullfoert) {
    return null;
  }

  if (typeof errorMessage === 'string') {
    return (
      <NewDocumentsStyledListHeader>
        <StyledHeading size="xsmall" level="2">
          Dokumenter under arbeid
          <ExclamationmarkTriangleIcon title={errorMessage} color="#ba3a26" />
        </StyledHeading>
        <DeleteDropArea isDragOver={isDragOver} />
      </NewDocumentsStyledListHeader>
    );
  }

  return (
    <NewDocumentsStyledListHeader>
      <StyledHeading size="xsmall" level="2">
        Dokumenter under arbeid
      </StyledHeading>
      <DeleteDropArea isDragOver={isDragOver} />
    </NewDocumentsStyledListHeader>
  );
};

const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
`;
