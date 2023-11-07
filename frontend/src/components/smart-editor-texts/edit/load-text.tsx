import { FileTextIcon } from '@navikt/aksel-icons';
import React from 'react';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { StandaloneTextVersions } from '@app/components/smart-editor-texts/edit/standalone-text-versions';

export const LoadText = () => {
  const { id } = useParams<{ id: string }>();

  if (id === undefined) {
    return (
      <EmptyContainer data-textid={id}>
        <FileTextIcon fontSize={400} aria-hidden />
      </EmptyContainer>
    );
  }

  return (
    <Container data-textid={id}>
      <StandaloneTextVersions id={id} />
    </Container>
  );
};

const Container = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(210mm + 64px);
  height: 100%;
  box-shadow: var(--a-shadow-small);
  border-radius: var(--a-border-radius-medium);
`;

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  color: var(--a-surface-subtle);
`;
