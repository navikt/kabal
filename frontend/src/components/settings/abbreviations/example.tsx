import { BodyShort, Heading, List, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  title: string;
  children: React.ReactNode;
  examples: React.ReactNode[];
  recommended?: boolean;
}

export const AbbrevationExample = ({ title, children, examples, recommended = false }: Props) => (
  <section>
    <StyledHeading size="small" spacing>
      {title}
      {recommended ? (
        <Tag variant="success" size="xsmall">
          Anbefalt
        </Tag>
      ) : null}
    </StyledHeading>
    <BodyShort size="small" spacing>
      {children}
    </BodyShort>
    <List as="ol" size="small">
      {examples.map((example, index) => (
        <List.Item key={index}>{example}</List.Item>
      ))}
    </List>
  </section>
);

const StyledHeading = styled(Heading)`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;
