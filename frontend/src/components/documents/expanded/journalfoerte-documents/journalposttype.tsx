import { Tag } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { Journalposttype } from '../../../../types/arkiverte-documents';
import { Fields } from '../styled-components/grid';

export const JournalposttypeTag = ({ type }: { type: Journalposttype | null }) => (
  <StyledJournalposttype>{getJournalposttype(type)}</StyledJournalposttype>
);

const StyledJournalposttype = styled.span`
  grid-area: ${Fields.Type};
`;

const getJournalposttype = (type: Journalposttype | null) => {
  if (type === null) {
    return (
      <Tag size="xsmall" variant="error" title="Journalposttype mangler">
        Ingen
      </Tag>
    );
  }

  switch (type) {
    case Journalposttype.INNGAAENDE:
      return (
        <Tag size="xsmall" variant="alt2" title="Inngående">
          I
        </Tag>
      );
    case Journalposttype.UTGAAENDE:
      return (
        <Tag size="xsmall" variant="alt3" title="Utgående">
          U
        </Tag>
      );
    case Journalposttype.NOTAT:
      return (
        <Tag size="xsmall" variant="alt1" title="Notat">
          N
        </Tag>
      );
  }
};
