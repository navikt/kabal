import { Tag } from '@navikt/ds-react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';

export const Meldekort = () => (
  <Tag data-color="neutral" variant="outline" size="small" style={{ gridArea: Fields.Meldekort }}>
    Meldekort
  </Tag>
);
