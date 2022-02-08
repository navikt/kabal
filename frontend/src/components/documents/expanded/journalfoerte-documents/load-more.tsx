import React from 'react';
import { StyledLoadMoreButton } from './styled-components';

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
      <StyledLoadMoreButton spinner={true} autoDisableVedSpinner={true}>
        Laster flere...
      </StyledLoadMoreButton>
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

  return <StyledLoadMoreButton onClick={() => setPage(pageReference)}>Last flere ({remaining})</StyledLoadMoreButton>;
};
