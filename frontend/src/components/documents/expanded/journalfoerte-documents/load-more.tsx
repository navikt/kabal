import { Button } from '@navikt/ds-react';
import React from 'react';

interface Props {
  loadedDocuments: number;
  totalDocuments: number;
  pageReference: string | null;
  loading: boolean;
  setPage: (pageReference: string) => void;
}

export const LoadMore = ({ totalDocuments, loadedDocuments, pageReference, loading, setPage }: Props) => {
  if (totalDocuments === 0) {
    return null;
  }

  if (loading) {
    return (
      <Button loading={true} type="button" variant="secondary">
        Laster flere...
      </Button>
    );
  }

  const remaining = totalDocuments - loadedDocuments;
  const hasMore = remaining > 0;

  if (!hasMore) {
    return null;
  }

  if (pageReference === null) {
    return null;
  }

  return (
    <Button type="button" variant="secondary" onClick={() => setPage(pageReference)}>
      Last flere ({remaining})
    </Button>
  );
};
