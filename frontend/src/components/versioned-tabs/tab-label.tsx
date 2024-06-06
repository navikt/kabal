import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';

interface TabLabelProps {
  isDraft: boolean;
  isPublished: boolean;
  date: string;
}

export const TabLabel = ({ isDraft, isPublished, date }: TabLabelProps) => {
  if (isPublished) {
    return (
      <Container>
        <Tag size="xsmall" variant="info">
          Aktiv
        </Tag>
        {isoDateTimeToPretty(date)}
      </Container>
    );
  }

  if (isDraft) {
    return (
      <Container>
        <Tag size="xsmall" variant="warning">
          Utkast
        </Tag>
        {isoDateTimeToPretty(date)}
      </Container>
    );
  }

  return (
    <Container>
      <Tag size="xsmall" variant="neutral">
        Inaktiv
      </Tag>
      {isoDateTimeToPretty(date)}
    </Container>
  );
};

const Container = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
