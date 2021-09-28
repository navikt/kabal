import React, { useCallback } from 'react';
import { IDokumenterRespons } from '../../../redux-api/dokumenter/types';
import { StyledLastFlereKnapp } from '../styled-components/fullvisning';

interface LoadMoreProps {
  dokumenter: IDokumenterRespons;
  loading: boolean;
  setPage: (pageReference: string | null) => void;
}

export const LoadMore = ({ dokumenter, loading, setPage }: LoadMoreProps) => {
  const onClick = useCallback(() => setPage(dokumenter.pageReference), [dokumenter.pageReference, setPage]);

  const remaining = dokumenter.totaltAntall - dokumenter.dokumenter.length;
  const hasMore = remaining !== 0;

  if (!hasMore) {
    return null;
  }

  return (
    <StyledLastFlereKnapp onClick={onClick} spinner={loading} autoDisableVedSpinner={true}>
      Last flere ({remaining})
    </StyledLastFlereKnapp>
  );
};
