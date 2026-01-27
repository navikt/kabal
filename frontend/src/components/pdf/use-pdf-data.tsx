import { toast } from '@app/components/toast/store';
import { Section } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { isKabalApiErrorData, type KabalApiErrorData } from '@app/types/errors';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UsePdfData {
  data: Blob | null;
  loading: boolean;
  refresh: () => void;
  error: string | undefined;
}

export const usePdfData = (url: string | undefined, query?: Record<string, string>): UsePdfData => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Blob | null>(null);
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
        return response.blob();
      }

      const { status } = response;

      if (status === 401) {
        setError('Ikke innlogget');
        toast.error(<ErrorMessage error="Ikke innlogget" />);

        if (ENVIRONMENT.isDeployed) {
          window.location.assign('/oauth2/login');
        }

        return null;
      }

      if (!(response.headers.get('content-type')?.includes('application/json') ?? false)) {
        const text = await response.text();

        setError(text);
        toast.error(<ErrorMessage error={text} />);

        return null;
      }

      const json = await response.json();

      if (isKabalApiErrorData(json)) {
        setError(`${json.title}: ${json.status} - ${json.detail}`);
        toast.error(<ErrorMessage error={json} />);

        return null;
      }

      const text = JSON.stringify(json);
      setError(`Ukjent feil (${status}) - ${text}`);
      toast.error(<ErrorMessage error={{ status, title: 'Ukjent feil', detail: text }} />);

      return null;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return null;
      }

      const message = e instanceof Error ? e.message : 'Ukjent feil';
      setError(message);

      toast.error(<ErrorMessage error={message} />);
    } finally {
      setLoading(false);
    }

    return null;
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
