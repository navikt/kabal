import { Alert } from '@navikt/ds-react';

export const ReturWarning = () => (
  <Alert variant="warning" size="small">
    Husk at retur ikke er det samme som opphevet. Etter forvaltningsloven § 33 kan NAV Klageinstans returnere en
    klagesak uten avgjørelse dersom det er formelle feil ved forberedelsen av klagesaken. Retur er ingen avgjørelse og
    gjøres svært sjelden.
  </Alert>
);
