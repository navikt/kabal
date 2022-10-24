import { Button } from '@navikt/ds-react';
import React from 'react';

interface Props {
  loadedDocuments: number;
  totalDocuments: number;
  loading: boolean;
  onNextPage: () => void;
}

export const LoadMore = ({ totalDocuments, loadedDocuments, loading, onNextPage }: Props) => {
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

  return (
    <Button type="button" variant="secondary" onClick={onNextPage}>
      Last flere ({remaining})
    </Button>
  );
};
