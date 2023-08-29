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
      <Tag size="small" variant="error" title="Journalposttype mangler">
        Ingen
      </Tag>
    );
  }

  switch (type) {
    case Journalposttype.INNGAAENDE:
      return (
        <Tag size="small" variant="alt2" title="Inngående">
          I
        </Tag>
      );
    case Journalposttype.UTGAAENDE:
      return (
        <Tag size="small" variant="alt3" title="Utgående">
          U
        </Tag>
      );
    case Journalposttype.NOTAT:
      return (
        <Tag size="small" variant="alt1" title="Notat">
          N
        </Tag>
      );
  }
};
