import React from 'react';
import { IDocumentsResponse } from '../../../redux-api/dokumenter/types';
import { StyledLoadMoreButton } from '../styled-components/fullvisning';

interface LoadMoreProps {
  documents?: IDocumentsResponse;
  loading: boolean;
  setPage: (pageReference: string) => void;
}

export const LoadMore = ({ documents, loading, setPage }: LoadMoreProps) => {
  if (typeof documents === 'undefined') {
    return null;
  }

  const remaining = documents.totaltAntall - documents.dokumenter.length;
  const hasMore = remaining !== 0;

  if (!hasMore) {
    return null;
  }

  const { pageReference } = documents;

  if (pageReference === null) {
    return null;
  }

  return (
    <StyledLoadMoreButton onClick={() => setPage(pageReference)} spinner={loading} autoDisableVedSpinner={true}>
      Last flere ({remaining})
    </StyledLoadMoreButton>
  );
};
