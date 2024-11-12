import { Alert } from '@navikt/ds-react';

export const ReturWarning = () => (
  <Alert variant="warning" size="small">
    Husk at retur ikke er det samme som opphevet. Etter forvaltningsloven § 33 kan Nav Klageinstans returnere en
    klagesak uten avgjørelse dersom det er formelle feil ved forberedelsen av klagesaken. Retur er ingen avgjørelse og
    gjøres svært sjelden.
  </Alert>
);

export const AnkeDelvisMedholWarning = () => (
  <Alert variant="warning" size="small">
    Du har valgt utfall delvis medhold. Kabal vil opprette en Anke i Trygderetten-oppgave for den delen som går videre
    til Trygderetten. Dersom saken ikke skal videre til Trygderetten, velg utfall medhold.
  </Alert>
);
