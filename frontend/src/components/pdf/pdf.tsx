import { PdfViewer } from '@app/components/pdf/pdf-viewer';
import type { RotationDegrees, SetRotation } from '@app/components/pdf/rotation';
import type { UsePdfData } from '@app/components/pdf/use-pdf-data';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
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

interface Props extends UsePdfData {
  rotation: RotationDegrees;
  setRotation: SetRotation;
}

export const Pdf = ({ loading, data, error, refresh, rotation, setRotation }: Props) => {
  const [fixPdf, isLoading] = useFixPdf(refresh);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [loadedData, setLoadedData] = useState<Blob | null>(null);

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
        const pdf = await loadingTask.promise;
        setPdfDocument(pdf);
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

  useEffect(() => {
    return () => {
      if (pdfDocument !== null) {
        pdfDocument.destroy();
      }
    };
  }, [pdfDocument]);

  const displayError = error ?? pdfError;
  const pdfLoading = data !== null && data !== loadedData;
  const isLoaderVisible = loading || pdfLoading;

  if (displayError !== undefined && displayError !== null) {
    return (
      <div className="grow p-5">
        <Alert variant="error" size="small">
          <HStack gap="space-16" align="center">
            <Heading size="small">Feil ved lasting av PDF</Heading>
            <BodyShort>
              Hvis dette er et brev som er skrevet i Kabal kan det hende det hjelper å:{' '}
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
        <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-ax-bg-neutral-moderate/70 backdrop-blur-xs">
          <VStack align="center" gap="space-8">
            <Loader size="3xlarge" />
            <BodyShort>{loading ? 'Laster PDF ...' : 'Tegner PDF ...'}</BodyShort>
          </VStack>
        </div>
      ) : null}
      {pdfDocument !== null ? (
        <PdfViewer pdfDocument={pdfDocument} rotation={rotation} setRotation={setRotation} />
      ) : null}
    </div>
  );
};

export interface UsePdfData {
  data: string | undefined;
  loading: boolean;
  refresh: () => void;
  error: string | undefined;
}

export const usePdfData = (url: string | undefined, query?: Record<string, string>): UsePdfData => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string>();
  const [error, setError] = useState<string>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const getData = useCallback(async (url: string | undefined, query?: Record<string, string>) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    setError(undefined);

    try {
      const params = new URLSearchParams(query);
      params.append('version', Date.now().toString());

      const response = await fetch(`${url}?${params.toString()}`, { signal });

      if (response.ok) {
        const blob = await response.blob();

        return `${URL.createObjectURL(blob)}${PDFparams}`;
      }

      await handleError(response, setError);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }

      const message = e instanceof Error ? e.message : 'Ukjent feil';
      setError(message);

      toast.error(<ErrorMessage error={message} />);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url === undefined) {
      return;
    }

    getData(url, query).then(setData);
  }, [url, query, getData]);

  const refresh = () => getData(url).then(setData);

  return { data, loading, refresh, error };
};

const PDFparams = '#toolbar=1&view=fitH&zoom=page-width';

const ErrorMessage = ({ error }: { error: string | KabalApiErrorData }) => (
  <VStack>
    <Heading size="xsmall" level="1" spacing>
      Feil ved henting av PDF
    </Heading>

    {isKabalApiErrorData(error) ? (
      <VStack gap="space-8">
        <Section heading="Tittel">{error.title}</Section>
        {error.detail === undefined ? null : <Section heading="Detaljer">{error.detail}</Section>}
        <Section heading="Statuskode">{error.status}</Section>
      </VStack>
    ) : (
      <Section heading="Detaljer">{error}</Section>
    )}
  </VStack>
);

const handleError = async (response: Response, setError: (error: string) => void) => {
  const { status } = response;

  if (status === 401) {
    setError('Ikke innlogget');
    toast.error(<ErrorMessage error="Ikke innlogget" />);

    if (ENVIRONMENT.isDeployed) {
      window.location.assign('/oauth2/login');
    }

    return;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
    const json = await response.json();

    if (isKabalApiErrorData(json)) {
      setError(`${json.title} (${json.status})${json.detail === undefined ? '' : `: ${json.detail}`}`);
      toast.error(<ErrorMessage error={json} />);

      return;
    }

    const text = JSON.stringify(json);
    setError(`Ukjent feil (${status}) - ${text}`);
    toast.error(<ErrorMessage error={{ status, title: 'Ukjent feil', detail: text }} />);

    return;
  }

  const text = await response.text();

  setError(text);
  toast.error(<ErrorMessage error={text} />);
};
