import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { Tag } from '@navikt/ds-react';
import { memo } from 'react';

export const JournalposttypeTag = memo(
  ({ type }: { type: Journalposttype | null }) => (
    <span style={{ gridArea: Fields.Type }}>{getJournalposttype(type)}</span>
  ),
  (prevProps, nextProps) => prevProps.type === nextProps.type,
);

JournalposttypeTag.displayName = 'JournalposttypeTag';

const getJournalposttype = (type: Journalposttype | null) => {
  if (type === null) {
    return (
      <Tag data-color="danger" size="small" variant="outline" title="Journalposttype mangler">
        Ingen
      </Tag>
    );
  }

  switch (type) {
    case Journalposttype.INNGAAENDE:
      return (
        <Tag data-color="meta-lime" className="w-6" size="small" variant="outline" title="Inngående">
          I
        </Tag>
      );
    case Journalposttype.UTGAAENDE:
      return (
        <Tag data-color="info" className="w-6" size="small" variant="outline" title="Utgående">
          U
        </Tag>
      );
    case Journalposttype.NOTAT:
      return (
        <Tag data-color="meta-purple" className="w-6" size="small" variant="outline" title="Notat">
          N
        </Tag>
      );
  }
};
