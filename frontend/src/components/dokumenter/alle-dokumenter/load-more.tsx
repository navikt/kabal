import React from 'react';
import { StyledLoadMoreButton } from '../styled-components/fullvisning';

interface LoadMoreProps {
  loadedDocuments: number;
  totalDocuments: number;
  pageReference: string | null;
  loading: boolean;
  setPage: (pageReference: string) => void;
}

export const LoadMore = ({ totalDocuments, loadedDocuments, pageReference, loading, setPage }: LoadMoreProps) => {
  if (totalDocuments === 0) {
    return null;
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
    <StyledLoadMoreButton onClick={() => setPage(pageReference)} spinner={loading} autoDisableVedSpinner={true}>
      Last flere ({remaining})
    </StyledLoadMoreButton>
  );
};
