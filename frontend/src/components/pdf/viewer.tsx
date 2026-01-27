import { INITIAL_SCALE, MAX_SCALE, MIN_SCALE, SCALE_STEP, SCROLL_STEP } from '@app/components/pdf/constants';
import { FitHeight } from '@app/components/pdf/fit-height';
import { PdfPage } from '@app/components/pdf/page';
import { PageSelector, SinglePage } from '@app/components/pdf/page-selector';
import { Rotation, type RotationDegrees } from '@app/components/pdf/rotation';
import { ScaleInput } from '@app/components/pdf/scale';
import { snapDown, snapUp } from '@app/functions/snap';
import { isMetaKey, Keys } from '@app/keys';
import { HStack, VStack } from '@navikt/ds-react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PdfViewerProps {
  pdfDocument: PDFDocumentProxy;
  isDarkMode: boolean;
}

export const PdfViewer = ({ pdfDocument, isDarkMode }: PdfViewerProps) => {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [rotation, setRotation] = useState<RotationDegrees>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const loadPages = async () => {
      const loadedPages: PDFPageProxy[] = [];

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        loadedPages.push(page);
      }

      setPages(loadedPages);
    };

    loadPages();
  }, [pdfDocument]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer === null || pages.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibility = 0;
        let mostVisiblePage = currentPage;

        for (const entry of entries) {
          const pageNumber = Number(entry.target.getAttribute('data-page-number'));

          if (entry.intersectionRatio > maxVisibility) {
            maxVisibility = entry.intersectionRatio;
            mostVisiblePage = pageNumber;
          }
        }

        if (maxVisibility > 0) {
          setCurrentPage(mostVisiblePage);
        }
      },
      {
        root: scrollContainer,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const pageRef of pageRefs.current.values()) {
      observer.observe(pageRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [pages, currentPage]);

  const setPageRef = useCallback((pageNumber: number, element: HTMLDivElement | null) => {
    if (element === null) {
      pageRefs.current.delete(pageNumber);
    } else {
      pageRefs.current.set(pageNumber, element);
    }
  }, []);

  const handlePageSelect = useCallback((pageNumber: number) => {
    const pageElement = pageRefs.current.get(pageNumber);

    if (pageElement !== undefined) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => snapUp(prev, SCALE_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => snapDown(prev, SCALE_STEP, MIN_SCALE));
  }, []);

  const goToNextPage = useCallback(() => {
    if (currentPage < pdfDocument.numPages) {
      handlePageSelect(currentPage + 1);
    }
  }, [currentPage, pdfDocument.numPages, handlePageSelect]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageSelect(currentPage - 1);
    }
  }, [currentPage, handlePageSelect]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const meta = isMetaKey(event);

      if (meta) {
        switch (event.key) {
          case Keys.Plus:
          case Keys.Equals:
            event.preventDefault();
            handleZoomIn();
            return;
          case Keys.Dash:
            event.preventDefault();
            handleZoomOut();
            return;
          case Keys.ArrowDown:
            event.preventDefault();
            goToNextPage();
            return;
          case Keys.ArrowUp:
            event.preventDefault();
            goToPreviousPage();
            return;
        }
      }

      switch (event.key) {
        case Keys.PageDown:
          event.preventDefault();
          goToNextPage();
          return;
        case Keys.PageUp:
          event.preventDefault();
          goToPreviousPage();
          return;
      }
    },
    [handleZoomIn, handleZoomOut, goToNextPage, goToPreviousPage],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (container === null) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();

        if (event.deltaY < 0) {
          setScale((prev) => snapUp(prev, SCROLL_STEP, MAX_SCALE));
        } else {
          setScale((prev) => snapDown(prev, SCROLL_STEP, MIN_SCALE));
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <VStack
      ref={containerRef}
      width="100%"
      height="100%"
      overflow="hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-ax-accent-500 focus-within:outline"
    >
      <HStack
        flexShrink="0"
        align="center"
        justify="space-between"
        padding="space-8"
        wrap={false}
        className="border-ax-border-neutral border-b bg-ax-bg-neutral-moderate"
      >
        <HStack gap="space-4" align="center" wrap={false}>
          <ScaleInput scale={scale} setScale={setScale} />

          <FitHeight
            currentPage={currentPage}
            pages={pages}
            rotation={rotation}
            scrollContainerRef={scrollContainerRef}
            setScale={setScale}
          />

          <Rotation setRotation={setRotation} />
        </HStack>

        {pdfDocument.numPages === 1 ? (
          <SinglePage />
        ) : (
          <PageSelector currentPage={currentPage} totalPages={pdfDocument.numPages} onPageSelect={handlePageSelect} />
        )}
      </HStack>

      <div ref={scrollContainerRef} className="min-h-0 grow overflow-auto p-4">
        <VStack align="center">
          {pages.map((page) => (
            <div key={page.pageNumber} ref={(el) => setPageRef(page.pageNumber, el)} data-page-number={page.pageNumber}>
              <PdfPage page={page} scale={scale / 100} rotation={rotation} isDarkMode={isDarkMode} />
            </div>
          ))}
        </VStack>
      </div>
    </VStack>
  );
};
