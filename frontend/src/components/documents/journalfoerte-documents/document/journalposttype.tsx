import { Tag } from '@navikt/ds-react';
import React, { memo } from 'react';
import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { Journalposttype } from '@app/types/arkiverte-documents';

export const JournalposttypeTag = memo(
  ({ type }: { type: Journalposttype | null }) => (
    <StyledJournalposttype>{getJournalposttype(type)}</StyledJournalposttype>
  ),
  (prevProps, nextProps) => prevProps.type === nextProps.type,
);

JournalposttypeTag.displayName = 'JournalposttypeTag';

const StyledJournalposttype = styled.span`
  grid-area: ${Fields.Type};
`;

const getJournalposttype = (type: Journalposttype | null) => {
  if (type === null) {
    return (
      <StyledTag size="xsmall" variant="error" title="Journalposttype mangler">
        Ingen
      </StyledTag>
    );
  }

  switch (type) {
    case Journalposttype.INNGAAENDE:
      return (
        <StyledTag size="xsmall" variant="alt2" title="Inngående">
          I
        </StyledTag>
      );
    case Journalposttype.UTGAAENDE:
      return (
        <StyledTag size="xsmall" variant="alt3" title="Utgående">
          U
        </StyledTag>
      );
    case Journalposttype.NOTAT:
      return (
        <StyledTag size="xsmall" variant="alt1" title="Notat">
          N
        </StyledTag>
      );
  }
};

const StyledTag = styled(Tag)`
  width: 20px;
  height: 20px;
`;
