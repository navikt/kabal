import { CheckmarkIcon, ExternalLinkIcon, FilesIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Link, Tooltip } from '@navikt/ds-react';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from '@app/components/toast/store';
import { EXTERNAL_URL_MODIA } from '@app/domain/eksterne-lenker';
import { ENVIRONMENT } from '@app/environment';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { pushEvent } from '@app/observability';
import { KABAL_BEHANDLINGER_BASE_PATH } from '@app/redux-api/common';
import { ISakenGjelder } from '@app/types/oppgave-common';

interface LinkProps {
  sakenGjelder: ISakenGjelder;
}

export const Modia = ({ sakenGjelder }: LinkProps) => {
  const url = `${EXTERNAL_URL_MODIA}/person/${sakenGjelder.id}`;
  const eventName = 'modia-link';
  const appName = 'Modia';

  if (ENVIRONMENT.isAnsattDomain || ENVIRONMENT.isLocal) {
    return (
      <Tooltip content={getTooltipContent(appName)} placement="bottom">
        <CopyButton
          size="small"
          copyText={url}
          aria-label={getTitle(appName)}
          onClick={() => pushEvent(eventName, undefined, 'external-links')}
          text={appName}
          activeText={appName}
        />
      </Tooltip>
    );
  }

  return <AppLink appName={appName} url={url} eventName={eventName} />;
};

export const AaRegisteret = () => {
  const oppgaveId = useOppgaveId();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  const baseUrl = `${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/aaregister`;
  const eventName = 'aaregister-link';
  const appName = 'Aa-registeret';

  if (ENVIRONMENT.isAnsattDomain || ENVIRONMENT.isLocal) {
    return <AsyncCopyLink baseUrl={baseUrl} appName={appName} eventName={eventName} />;
  }

  return <AppLink appName={appName} url={`${baseUrl}/redirect`} eventName={eventName} />;
};

export const Ainntekt = () => {
  const oppgaveId = useOppgaveId();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  const baseUrl = `${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/ainntekt`;
  const eventName = 'ainntekt-link';
  const appName = 'A-inntekt';

  if (ENVIRONMENT.isAnsattDomain || ENVIRONMENT.isLocal) {
    return <AsyncCopyLink baseUrl={baseUrl} appName={appName} eventName={eventName} />;
  }

  return <AppLink appName={appName} url={`${baseUrl}/redirect`} eventName={eventName} />;
};

interface RedirectLinkProps {
  appName: string;
  url: string;
  eventName: string;
}

const AppLink = ({ appName, url, eventName }: RedirectLinkProps) => (
  <Button
    as={Link}
    size="small"
    variant="tertiary-neutral"
    href={url}
    target="_blank"
    aria-label={getTitle(appName)}
    title="Åpne i ny fane"
    rel="noreferrer"
    onClick={() => pushEvent(eventName, undefined, 'external-links')}
  >
    {appName} <ExternalLinkIcon title="Ekstern lenke" />
  </Button>
);

interface AsyncCopyLinkProps {
  baseUrl: string;
  appName: string;
  eventName: string;
}

const AsyncCopyLink = ({ baseUrl, eventName, appName }: AsyncCopyLinkProps) => {
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(async () => {
    try {
      const url = await getLink(`${baseUrl}/url`);
      setCopied(true);
      navigator.clipboard.writeText(url);
      pushEvent(eventName, undefined, 'external-links');
    } catch (error) {
      toast.error(`Kunne ikke kopiere lenken til ${appName}`);
    }
  }, [appName, eventName, baseUrl]);

  return (
    <Tooltip content={getTooltipContent(appName)} placement="bottom">
      <Button
        size="small"
        variant="tertiary-neutral"
        aria-label={getTitle(appName)}
        onClick={onClick}
        onAnimationEnd={() => setCopied(false)}
        icon={copied ? <JumpingSuccess aria-hidden /> : <FilesIcon aria-hidden />}
      >
        {appName}
      </Button>
    </Tooltip>
  );
};

const getTooltipContent = (appName: string) => `${appName} kan kun åpnes via Applikasjonsportalen. Lim inn lenken der.`;
const getTitle = (appName: string) => `Ekstern lenke til ${appName} for denne personen`;

const JumpingSuccess = styled(CheckmarkIcon)`
  animation: akselCopyButtonIconAnimation 2s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

interface UrlResponse {
  url: string;
}

const getLink = async (url: string) => {
  const res = await fetch(url, { method: 'GET', cache: 'no-cache' });

  if (!res.ok) {
    throw new Error(`${res.status} - Failed to fetch external link`);
  }

  const json: unknown = await res.json();

  if (!isUrlResponse(json)) {
    throw new Error('Invalid response body');
  }

  return json.url;
};

const isUrlResponse = (response: unknown): response is UrlResponse =>
  typeof response === 'object' && response !== null && 'url' in response;
