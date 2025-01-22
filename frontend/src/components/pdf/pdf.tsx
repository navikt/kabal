import { toast } from '@app/components/toast/store';
import { Details } from '@app/components/toast/toast-content/fetch-error-toast';
import { type ApiError, isApiError } from '@app/types/errors';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, HStack, Heading, Loader, VStack } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';

export const Pdf = ({ loading, data, error, refresh }: UsePdfData) => {
  if (error !== undefined) {
    return (
      <div className="grow p-5">
        <Alert variant="error" size="small">
          <HStack gap="2" align="center">
            {error}{' '}
            <Button size="small" icon={<ArrowsCirclepathIcon aria-hidden />} onClick={refresh}>
              Prøv igjen
            </Button>
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

export const usePdfData = (url: string | undefined, skip = false): UsePdfData => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string>();
  const [error, setError] = useState<string>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (url === undefined || skip) {
      return;
    }

    getData(url).then(setData);
  }, [url, skip]);

  const getData = async (u: string | undefined) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(`${u}?version=${Date.now()}`, { signal });

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
  };

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
