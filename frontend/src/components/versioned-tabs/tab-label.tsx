import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

interface TabLabelProps {
  isDraft: boolean;
  isPublished: boolean;
  children: string | number;
}

export const TabLabel = ({ isDraft, isPublished, children }: TabLabelProps) => {
  if (isPublished) {
    return (
      <Container>
        <Tag size="xsmall" variant="info">
          Aktiv
        </Tag>
        Versjon {children}
      </Container>
    );
  }

  if (isDraft) {
    return (
      <Container>
        <Tag size="xsmall" variant="warning">
          Utkast
        </Tag>
        Versjon {children}
      </Container>
    );
  }

  return (
    <Container>
      <Tag size="xsmall" variant="neutral">
        Inaktiv
      </Tag>
      Versjon {children}
    </Container>
  );
};

const Container = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
