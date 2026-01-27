import { MAX_SCALE, MIN_SCALE } from '@app/components/pdf/constants';
import { ChevronUpDownIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import type { PDFPageProxy } from 'pdfjs-dist';
import { useCallback } from 'react';

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  pages: PDFPageProxy[];
  currentPage: number;
  rotation: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

export const FitHeight = ({ scrollContainerRef, pages, currentPage, rotation, setScale }: Props) => {
  const handleFitToHeight = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    const currentPageData = pages[currentPage - 1];

    if (scrollContainer === null || currentPageData === undefined) {
      return;
    }

    const viewport = currentPageData.getViewport({ scale: 1, rotation });
    const pageHeight = viewport.height;
    const fitScale = Math.floor((scrollContainer.clientHeight / pageHeight) * 100);
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, fitScale));
    setScale(clampedScale);
  }, [pages, currentPage, rotation, setScale, scrollContainerRef]);

  return (
    <Button
      size="xsmall"
      variant="tertiary"
      onClick={handleFitToHeight}
      data-color="neutral"
      icon={<ChevronUpDownIcon aria-hidden />}
      title="Fit to height"
    />
  );
};
