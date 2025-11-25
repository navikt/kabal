import { AppTheme, useAppTheme } from '@app/app-theme';
import { toast } from '@app/components/toast/store';
import { Section } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { isKabalApiErrorData, type KabalApiErrorData } from '@app/types/errors';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, BoxNew, Button, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
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
  const appTheme = useAppTheme();

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
            <Button
              variant="secondary-neutral"
              size="small"
              icon={<ArrowsCirclepathIcon aria-hidden />}
              onClick={refresh}
            >
              Last PDF på nytt
            </Button>
            <code className="border-2 border-ax-border-neutral bg-ax-bg-neutral-moderate p-2 text-xs">{error}</code>
          </HStack>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative flex w-full grow">
      {loading ? (
        <BoxNew
          background="neutral-moderate"
          height="100%"
          width="100%"
          className="absolute flex items-center justify-center"
        >
          <Loader size="3xlarge" />
        </BoxNew>
      ) : null}
      <object
        data={data}
        aria-label="PDF"
        type="application/pdf"
        name="pdf-viewer"
        className="w-full"
        style={{ filter: appTheme === AppTheme.DARK ? 'hue-rotate(180deg) invert(1)' : 'none' }}
      />
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

      const { status } = response;

      if (status === 401) {
        setError('Ikke innlogget');
        toast.error(<ErrorMessage error="Ikke innlogget" />);

        if (ENVIRONMENT.isDeployed) {
          window.location.assign('/oauth2/login');
        }

        return;
      }

      if (!(response.headers.get('content-type')?.includes('application/json') ?? false)) {
        const text = await response.text();

        setError(text);
        toast.error(<ErrorMessage error={text} />);

        return;
      }

      const json = await response.json();

      if (isKabalApiErrorData(json)) {
        setError(`${json.title}: ${json.status} - ${json.detail}`);
        toast.error(<ErrorMessage error={json} />);

        return;
      }

      const text = JSON.stringify(json);
      setError(`Ukjent feil (${status}) - ${text}`);
      toast.error(<ErrorMessage error={{ status, title: 'Ukjent feil', type: 'about:blank', detail: text }} />);

      return;
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

    <BodyShort size="small" spacing>
      Ta kontakt med Team Klage på Teams.
    </BodyShort>

    {isKabalApiErrorData(error) ? (
      <>
        <Section heading="Tittel">{error.title}</Section>
        <Section heading="Statuskode">{error.status}</Section>
        <Section heading="Detaljer">{error.detail}</Section>
      </>
    ) : (
      <Section heading="Detaljer">{error}</Section>
    )}
  </VStack>
);
