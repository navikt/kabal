import { MAX_SCALE, MIN_SCALE } from '@app/components/pdf/constants';
import { clamp } from '@app/functions/clamp';
import { ChevronUpDownIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import type { PDFPageProxy } from 'pdfjs-dist';
import { useCallback } from 'react';

interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  pages: PDFPageProxy[];
  currentPage: number;
  rotation: number;
  padding: number;
  onFitToHeight: (scale: number) => void;
}

export const FitHeight = ({ scrollContainerRef, pages, currentPage, rotation, padding, onFitToHeight }: Props) => {
  const handleFitToHeight = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    const currentPageData = pages[currentPage - 1];

    if (scrollContainer === null || currentPageData === undefined) {
      return;
    }

    const viewport = currentPageData.getViewport({ scale: 1, rotation });
    const pageHeight = viewport.height;
    const scrollContainerHeight = scrollContainer.clientHeight - padding;
    const fitScale = Math.floor((scrollContainerHeight / pageHeight) * 100);
    const clampedScale = clamp(fitScale, MIN_SCALE, MAX_SCALE);
    onFitToHeight(clampedScale);
  }, [pages, currentPage, rotation, scrollContainerRef, padding, onFitToHeight]);

  return (
    <Tooltip content="Tilpass høyden" placement="top" describesChild>
      <Button
        size="xsmall"
        variant="tertiary"
        onClick={handleFitToHeight}
        data-color="neutral"
        icon={<ChevronUpDownIcon aria-hidden />}
      />
    </Tooltip>
  );
};
