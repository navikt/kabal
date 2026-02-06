import { getA4Dimensions } from '@app/components/pdf/pdf-section-placeholder';
import { RotatablePage } from '@app/components/pdf/rotatable-page';
import type { HighlightRect } from '@app/components/pdf/search/types';
import { StickyHeader } from '@app/components/pdf/sticky-header';
import type { PdfEntry } from '@app/components/pdf/types';
import { usePdfData } from '@app/components/pdf/use-pdf-data';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy, type PDFPageProxy } from 'pdfjs-dist';
import { useCallback, useEffect, useRef, useState } from 'react';

// Ensure pdfjs worker is configured (idempotent)
GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;

interface LoadedPdfSectionProps {
  pdf: PdfEntry;
  scale: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onPageCountReady: (pageCount: number) => void;
  setPageRef?: (pageNumber: number, element: HTMLDivElement | null) => void;
  highlightsByPage?: Map<number, HighlightRect[]>;
  currentMatchIndex?: number;
}

export const LoadedPdfSection = ({
  pdf,
  scale,
  scrollContainerRef,
  onPageCountReady,
  setPageRef,
  highlightsByPage,
  currentMatchIndex,
}: LoadedPdfSectionProps) => {
  const { data, loading, error, refresh } = usePdfData(pdf.url, pdf.query);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [loadedData, setLoadedData] = useState<Blob | null>(null);
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [fixPdf, isFixing] = useFixPdf(refresh);
  const [currentPage, setCurrentPage] = useState(1);
  const internalPageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // --- track the most-visible page within this section ---
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
          const pageNumber = Number.parseInt(entry.target.getAttribute('data-page-number') ?? '1', 10);

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

    for (const pageRef of internalPageRefs.current.values()) {
      observer.observe(pageRef);
    }

    return () => observer.disconnect();
  }, [pages, currentPage, scrollContainerRef]);

  const setInternalPageRef = useCallback(
    (pageNumber: number, element: HTMLDivElement | null) => {
      if (element === null) {
        internalPageRefs.current.delete(pageNumber);
      } else {
        internalPageRefs.current.set(pageNumber, element);
      }

      setPageRef?.(pageNumber, element);
    },
    [setPageRef],
  );

  // --- load PDF document from blob ---
  useEffect(() => {
    if (data === null) {
      setPdfDocument(null);
      setLoadedData(null);

      return;
    }

    const loadPdf = async () => {
      setPdfError(null);

      try {
        const loadingTask = getDocument(await data.arrayBuffer());
        const doc = await loadingTask.promise;
        setPdfDocument(doc);
        setLoadedData(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Kunne ikke laste PDF';
        setPdfError(message);
        setLoadedData(data);
        console.error('Error loading PDF:', e);
      }
    };

    loadPdf();
  }, [data]);

  // --- cleanup ---
  useEffect(() => {
    return () => {
      if (pdfDocument !== null) {
        pdfDocument.destroy();
      }
    };
  }, [pdfDocument]);

  // --- load pages from document ---
  useEffect(() => {
    if (pdfDocument === null) {
      setPages([]);

      return;
    }

    const loadPages = async () => {
      const loaded: PDFPageProxy[] = [];

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        loaded.push(page);
      }

      setPages(loaded);
    };

    loadPages();
  }, [pdfDocument]);

  // --- report page count to parent for lazy-loading coordination ---
  useEffect(() => {
    if (pages.length > 0) {
      onPageCountReady(pages.length);
    }
  }, [pages.length, onPageCountReady]);

  const displayError = error ?? pdfError;
  const pdfLoading = data !== null && data !== loadedData;
  const isLoaderVisible = loading || pdfLoading;

  // --- error state ---
  if (displayError !== undefined && displayError !== null) {
    return (
      <>
        <StickyHeader
          title={pdf.title}
          currentPage={null}
          numPages={null}
          newTab={pdf.newTab}
          variant={pdf.variant}
          isLoading={loading}
          refresh={refresh}
        />

        <div className="w-full grow p-5">
          <Alert variant="error" size="small">
            <HStack gap="space-16" align="center">
              <Heading size="small">Feil ved lasting av PDF</Heading>
              <BodyShort>
                Hvis dette er et brev som er skrevet i Kabal kan det hende det hjelper å{' '}
                <Button size="small" variant="primary" onClick={fixPdf} loading={isFixing}>
                  Åpne brevutformingen på nytt
                </Button>
                .
              </BodyShort>
              <Button
                data-color="neutral"
                variant="secondary"
                size="small"
                icon={<ArrowsCirclepathIcon aria-hidden />}
                onClick={refresh}
              >
                Last PDF på nytt
              </Button>
              <code className="border-2 border-ax-border-neutral bg-ax-bg-neutral-moderate p-2 text-xs">
                {displayError}
              </code>
            </HStack>
          </Alert>
        </div>
      </>
    );
  }

  const numPages = pdfDocument?.numPages ?? null;
  const a4 = getA4Dimensions(scale);

  const pageContainerStyle: React.CSSProperties | undefined =
    pages.length === 0 ? { width: a4.width, minHeight: a4.height } : undefined;

  return (
    <>
      <StickyHeader
        title={pdf.title}
        currentPage={currentPage}
        numPages={numPages}
        newTab={pdf.newTab}
        variant={pdf.variant}
        isLoading={loading}
        refresh={refresh}
      />

      <div className="relative flex w-full flex-col items-center gap-4" style={pageContainerStyle}>
        {isLoaderVisible ? (
          <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-ax-bg-neutral-moderate/70 backdrop-blur-xs">
            <VStack align="center" gap="space-8">
              <Loader size="3xlarge" />
              <BodyShort>{loading ? 'Laster PDF ...' : 'Tegner PDF ...'}</BodyShort>
            </VStack>
          </div>
        ) : null}

        {pages.map((page) => {
          const pageHighlights = highlightsByPage?.get(page.pageNumber);

          return (
            <RotatablePage
              key={page.pageNumber}
              page={page}
              url={pdf.url}
              scale={scale}
              highlights={pageHighlights}
              currentMatchIndex={currentMatchIndex}
              setPageRef={setInternalPageRef}
            />
          );
        })}
      </div>
    </>
  );
};

// ---------- helpers ----------

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useFixPdf = (refresh: () => void): [() => Promise<void>, boolean] => {
  const { setValue } = useSmartEditorEnabled();
  const [isLoading, setIsLoading] = useState(false);

  return [
    async () => {
      setIsLoading(true);
      setValue(false);
      await wait(200);
      setValue(true);
      await wait(5000);
      refresh();
      setIsLoading(false);
    },
    isLoading,
  ];
};
