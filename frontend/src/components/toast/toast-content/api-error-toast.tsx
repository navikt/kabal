import { toast } from '@app/components/toast/store';
import type { BFFError, KabalApiErrorData } from '@app/types/errors';
import { BodyLong, Heading, Label } from '@navikt/ds-react';

export const genericErrorToast = (heading: string, description: string) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      <Section heading="Beskrivelse">{description}</Section>
    </>,
  );

export const kabalErrorToast = (heading: string, { status, title, detail }: KabalApiErrorData) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      <Section heading="Tittel">{title}</Section>
      <Section heading="Status">{status}</Section>

      {detail === undefined ? null : <Section heading="Detaljer">{detail}</Section>}
    </>,
  );

export const bffErrorToast = (heading: string, { statusCode, error, message, code }: BFFError) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      <Section heading="Status">{statusCode}</Section>
      <Section heading="Error">{error}</Section>
      <Section heading="Melding">{message}</Section>

      {code === undefined ? null : <Section heading="Detaljer">{code}</Section>}
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
