import { ErrorMessage, Heading, Label } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

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
      <List>
        {errors.map((e) => (
          <li key={e.dokumentId}>
            <Label size="small">{e.title}</Label>
            <List>
              {e.errors.map((error) => (
                <li key={`${e.dokumentId}-${error}`}>
                  <ErrorMessage size="small">{error}</ErrorMessage>
                </li>
              ))}
            </List>
          </li>
        ))}
      </List>
    </Section>
  );
};

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Section = styled.section`
  margin-top: 8px;
`;
