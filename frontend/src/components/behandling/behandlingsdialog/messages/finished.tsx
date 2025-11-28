import { BodyShort, Heading } from '@navikt/ds-react';

export const FinishedCaseMessages = () => (
  <section className="pb-4">
    <Heading level="1" size="xsmall" spacing>
      Meldinger
    </Heading>

    <BodyShort size="small" className="text-ax-text-neutral-subtle italic">
      Alle meldinger er slettet fordi saken er fullført
    </BodyShort>
  </section>
);
