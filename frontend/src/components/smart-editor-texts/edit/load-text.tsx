import { Error, FileContent, Left, SelfService } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useGetTextByIdQuery } from '../../../redux-api/texts';
import { EditSmartEditorText } from './edit';

export const LoadText = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching, isUninitialized, isError } = useGetTextByIdQuery(id ?? skipToken);

  if (isError) {
    return (
      <EmptyContainer data-textid={id}>
        <StyledError width={48} height={48} />
        <StyledStatusText>
          Kunne ikke laste tekst med id: <code>{id}</code>
        </StyledStatusText>
      </EmptyContainer>
    );
  }

  if (isUninitialized) {
    return (
      <EmptyContainer data-textid={id}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Left width={96} height={96} />
          <SelfService width={96} height={96} />
          <FileContent width={96} height={96} />
        </div>
        <StyledStatusText>Ingen tekst valgt</StyledStatusText>
      </EmptyContainer>
    );
  }

  if (isLoading || isFetching) {
    if (typeof data === 'undefined') {
      return (
        <Container data-textid={id}>
          <LoaderBackground>
            <Loader size="2xlarge" />
          </LoaderBackground>
        </Container>
      );
    }

    return (
      <Container data-textid={id}>
        <EditSmartEditorText key={id} {...data} />
        <LoaderBackground>
          <Loader size="2xlarge" />
        </LoaderBackground>
      </Container>
    );
  }

  if (isLoading || isFetching || typeof data === 'undefined') {
    return (
      <Container data-textid={id}>
        <LoaderBackground>
          <Loader size="2xlarge" />
        </LoaderBackground>
      </Container>
    );
  }

  return (
    <Container data-textid={id}>
      <EditSmartEditorText key={id} {...data} />
    </Container>
  );
};

const Container = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 350px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  border-radius: 4px;
`;

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const LoaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const StyledStatusText = styled.span`
  padding: 16px;
`;

const StyledError = styled(Error)`
  color: var(--a-surface-danger);
`;
