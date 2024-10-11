import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { Tag } from '@navikt/ds-react';
import { memo } from 'react';
import { styled } from 'styled-components';

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
        <StyledTag size="small" variant="alt2" title="Inngående">
          I
        </StyledTag>
      );
    case Journalposttype.UTGAAENDE:
      return (
        <StyledTag size="small" variant="alt3" title="Utgående">
          U
        </StyledTag>
      );
    case Journalposttype.NOTAT:
      return (
        <StyledTag size="small" variant="alt1" title="Notat">
          N
        </StyledTag>
      );
  }
};

const StyledTag = styled(Tag)`
  width: var(--a-spacing-6);
`;
