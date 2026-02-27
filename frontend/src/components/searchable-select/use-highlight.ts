import { useEffect, useRef, useState } from 'react';

export const useHighlight = (search: string) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const highlightedIndexRef = useRef(0);

  highlightedIndexRef.current = highlightedIndex;

  // biome-ignore lint/correctness/useExhaustiveDependencies: search is intentionally a dependency to trigger highlight reset on search change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  return { highlightedIndex, setHighlightedIndex, highlightedIndexRef };
};
