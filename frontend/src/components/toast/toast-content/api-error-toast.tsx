import { toast } from '@app/components/toast/store';
import { getErrorData } from '@app/functions/get-error-data';
import type { ApiRejectionError } from '@app/types/errors';
import { BodyLong, Heading, Label } from '@navikt/ds-react';

export const apiRejectionErrorToast = (heading: string, error: ApiRejectionError, description?: React.ReactNode) => {
  const { title, detail } = getErrorData(error.error);

  apiErrorToast(
    heading,
    description,
    <>
      <Section heading="Årsak">{title}</Section>

      {title === detail || detail === undefined ? null : <Section heading="Detaljer">{detail}</Section>}
    </>,
  );

  error.isUnhandledError = true;

  return error;
};

export const apiErrorToast = (heading: string, description?: React.ReactNode, extra?: React.ReactNode) => {
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        {heading}
      </Heading>

      {description === undefined ? null : <Section heading="Beskrivelse">{description}</Section>}

      {extra}
    </>,
  );
};

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
