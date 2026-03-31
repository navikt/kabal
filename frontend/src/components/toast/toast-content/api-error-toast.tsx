import { BodyLong, CopyButton, Heading, HStack, Label, Tag } from '@navikt/ds-react';
import { toast } from '@/components/toast/store';
import type { BFFError, KabalApiErrorData } from '@/types/errors';

export const genericErrorToast = (heading: string, description: string, traceId?: string) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      <Section heading="Beskrivelse">{description}</Section>

      <TraceIdSection traceId={traceId} />
    </>,
  );

export const kabalErrorToast = (heading: string, { status, title, detail }: KabalApiErrorData, traceId?: string) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      <Section heading="Tittel">{title}</Section>
      <Section heading="Status">{status}</Section>

      {detail === undefined ? null : <Section heading="Detaljer">{detail}</Section>}

      <TraceIdSection traceId={traceId} />
    </>,
  );

export const bffErrorToast = (heading: string, { statusCode, error, message, code }: BFFError, traceId?: string) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      <Section heading="Status">{statusCode}</Section>
      <Section heading="Error">{error}</Section>
      <Section heading="Melding">{message}</Section>

      {code === undefined ? null : <Section heading="Detaljer">{code}</Section>}

      <TraceIdSection traceId={traceId} />
    </>,
  );

interface SectionProps {
  children: React.ReactNode;
  heading: string;
}

export const Section = ({ heading: label, children }: SectionProps) => (
  <section>
    <Label as="h2" size="small">
      {label}
    </Label>

    <BodyLong size="small" className="whitespace-pre-wrap">
      {children}
    </BodyLong>
  </section>
);

interface TraceIdSectionProps {
  traceId?: string;
}

const TraceIdSection = ({ traceId }: TraceIdSectionProps) => {
  if (traceId === undefined) {
    return null;
  }

  return (
    <section>
      <Label as="h2" size="small">
        Trace ID
      </Label>

      <HStack align="center" gap="space-2" wrap={false}>
        <Tag size="xsmall" variant="moderate" data-color="neutral" className="min-w-0 font-mono" title={traceId}>
          <span className="truncate text-ax-small">{traceId}</span>
        </Tag>

        <CopyButton size="xsmall" copyText={traceId} className="shrink-0" />
      </HStack>
    </section>
  );
};
