import { toast } from '@app/components/toast/store';
import { Details } from '@app/components/toast/toast-content/fetch-error-toast';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { type ApiError, isApiError } from '@app/types/errors';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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

  if (error !== undefined) {
    return (
      <div className="grow p-5">
        <Alert variant="error" size="small">
          <HStack gap="4" align="center">
            <Heading size="small">Feil ved lasting av PDF</Heading>
            <BodyShort>
              Hvis dette er et brev som er skrevet i Kabal kan det hende det hjelper å{' '}
              <Button size="small" variant="primary" onClick={fixPdf} loading={isLoading}>
                Åpne brevutformingen på nytt
              </Button>
              .
            </BodyShort>
            <Button variant="secondary" size="small" icon={<ArrowsCirclepathIcon aria-hidden />} onClick={refresh}>
              Last PDF på nytt
            </Button>
            <code className="border-2 border-border-default bg-gray-200 p-2 text-xs">{error}</code>
          </HStack>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative flex w-full grow">
      {loading ? (
        <Box
          background="surface-neutral-moderate"
          height="100%"
          width="100%"
          className="absolute flex items-center justify-center"
        >
          <Loader size="3xlarge" />
        </Box>
      ) : null}
      <object data={data} aria-label="PDF" type="application/pdf" name="pdf-viewer" className="w-full" />
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

      if (!response.ok) {
        const json = await response.json();

        if (isApiError(json)) {
          setError(`${json.title}: ${json.status} - ${json.detail}`);
          toast.error(<ErrorMessage error={json} />);
        } else {
          const text = await response.text();

          setError(text);
          toast.error(<ErrorMessage error={text} />);
        }

        return undefined;
      }

      const blob = await response.blob();

      return `${URL.createObjectURL(blob)}${PDFparams}`;
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

const ErrorMessage = ({ error }: { error: string | ApiError }) => (
  <VStack>
    <Heading size="xsmall" level="1" spacing>
      Feil ved henting av PDF
    </Heading>

    <BodyShort size="small" spacing>
      Ta kontakt med Team Klage på Teams.
    </BodyShort>

    {isApiError(error) ? (
      <>
        <Details label="Tittel">{error.title}</Details>
        <Details label="Statuskode">{error.status}</Details>
        <Details label="Detaljer">{error.detail}</Details>
      </>
    ) : (
      <Details label="Detaljer">{error}</Details>
    )}
  </VStack>
);
