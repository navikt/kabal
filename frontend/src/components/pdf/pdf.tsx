import { AppTheme, useAppTheme } from '@app/app-theme';
import { INITIAL_SCALE } from '@app/components/pdf/constants';
import type { UsePdfData } from '@app/components/pdf/use-pdf-data';
import { PdfViewer } from '@app/components/pdf/viewer';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, Heading, HStack, Loader } from '@navikt/ds-react';
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useState } from 'react';

// Configure pdfjs worker
GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;

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

export const Pdf = ({ loading, data, error, refresh }: UsePdfData) => {
  const [fixPdf, isLoading] = useFixPdf(refresh);
  const appTheme = useAppTheme();
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (data === null) {
      setPdfDocument(null);

      return;
    }

    const loadPdf = async () => {
      setPdfLoading(true);
      setPdfError(null);

      try {
        const loadingTask = getDocument(await data.arrayBuffer());
        const pdf = await loadingTask.promise;
        setPdfDocument(pdf);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Kunne ikke laste PDF';
        setPdfError(message);
        console.error('Error loading PDF:', e);
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdf();
  }, [data]);

  useEffect(() => {
    return () => {
      if (pdfDocument !== null) {
        pdfDocument.destroy();
      }
    };
  }, [pdfDocument]);

  const displayError = error ?? pdfError;
  const isLoaderVisible = loading || pdfLoading;

  if (displayError !== undefined && displayError !== null) {
    return (
      <div className="grow p-5">
        <Alert variant="error" size="small">
          <HStack gap="space-16" align="center">
            <Heading size="small">Feil ved lasting av PDF</Heading>
            <BodyShort>
              Hvis dette er et brev som er skrevet i Kabal kan det hende det hjelper å{' '}
              <Button size="small" variant="primary" onClick={fixPdf} loading={isLoading}>
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
    );
  }

  return (
    <div className="relative flex min-h-0 w-full grow overflow-hidden">
      {isLoaderVisible ? (
        <Box
          background="neutral-moderate"
          height="100%"
          width="100%"
          className="absolute flex items-center justify-center"
          minWidth={`${INITIAL_SCALE * 6}px`}
        >
          <Loader size="3xlarge" />
        </Box>
      ) : null}
      {pdfDocument !== null ? <PdfViewer pdfDocument={pdfDocument} isDarkMode={appTheme === AppTheme.DARK} /> : null}
    </div>
  );
};
