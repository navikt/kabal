import { Alert, Tag } from '@navikt/ds-react';

export const ReturWarning = () => (
  <Alert variant="warning" size="small">
    Husk at retur ikke er det samme som opphevet. Etter forvaltningsloven § 33 kan klageinstansen returnere en klagesak
    uten avgjørelse dersom det er formelle feil ved forberedelsen av klagesaken. Retur er ingen avgjørelse og gjøres
    svært sjelden.
  </Alert>
);

export const AnkeDelvisMedholdWarning = () => (
  <Alert variant="warning" size="small">
    Du har valgt utfall delvis medhold. Kabal vil opprette en Anke i Trygderetten-oppgave for den delen som går videre
    til Trygderetten. Dersom saken ikke skal videre til Trygderetten, velg utfall medhold.
  </Alert>
);

export const AnkeITRHenvistWarning = () => (
  <Alert variant="warning" size="small">
    Du har valgt utfall{' '}
    <Tag data-color="meta-purple" size="small" variant="outline">
      Henvist
    </Tag>
    . Kabal vil opprette en ny ankeoppgave som du skal behandle. Vær oppmerksom på at du kun skal velge dette utfallet
    om saken skal tilbake til Trygderetten igjen. Skal du gjøre en ny vurdering i vedtak, må du velge utfall{' '}
    <Tag data-color="meta-purple" size="small" variant="outline">
      Opphevet
    </Tag>
    .
  </Alert>
);

export const AnkeITROpphevetWarning = () => (
  <Alert variant="warning" size="small">
    Du har valgt utfall{' '}
    <Tag data-color="meta-purple" size="small" variant="outline">
      Opphevet
    </Tag>
    . Ved fullføring vil du få mulighet til å velge å opprette ny behandling i Kabal. Vær oppmerksom på at du kun skal
    velge utfall{' '}
    <Tag data-color="meta-purple" size="small" variant="outline">
      Opphevet
    </Tag>{' '}
    dersom saken ikke skal tilbake til Trygderetten igjen, men du skal gjøre vurdering i vedtak. Dersom saken skal
    tilbake til Trygderetten igjen, velger du{' '}
    <Tag data-color="meta-purple" size="small" variant="outline">
      Henvist
    </Tag>
    .
  </Alert>
);
