import { ErrorMessage, Heading, Label, List } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';

export interface ValidationError {
  dokumentId: string;
  title: string;
  errors: string[];
}

interface Props {
  errors: ValidationError[];
}

export const Errors = ({ errors }: Props) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Section>
      <Heading level="1" size="xsmall">
        Følgende feil må rettes
      </Heading>
      <StyledOuterList>
        {errors
          .filter((e) => e.errors.length !== 0)
          .map((e) => (
            <List.Item key={e.dokumentId}>
              <Label size="small">{e.title}</Label>
              <List>
                {e.errors.map((error) => (
                  <List.Item key={`${e.dokumentId}-${error}`}>
                    <ErrorMessage size="small">{error}</ErrorMessage>
                  </List.Item>
                ))}
              </List>
            </List.Item>
          ))}
      </StyledOuterList>
    </Section>
  );
};

const StyledOuterList = styled(List)`
  > ul {
    margin-block-end: 0;
  }
`;

const Section = styled.section`
  margin-top: 8px;
`;
