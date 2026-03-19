import { Alert } from '@/components/alert/alert';
import { UtfallTag } from '@/components/utfall-tag/utfall-tag';
import { UtfallEnum } from '@/types/kodeverk';

const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <Alert variant="warning" marginBlock="space-16 space-0">
    {children}
  </Alert>
);

export const ReturWarning = () => (
  <WarningBox>
    Husk at retur ikke er det samme som opphevet. Etter forvaltningsloven § 33 kan klageinstansen returnere en klagesak
    uten avgjørelse dersom det er formelle feil ved forberedelsen av klagesaken. Retur er ingen avgjørelse og gjøres
    svært sjelden.
  </WarningBox>
);

export const AnkeDelvisMedholdWarning = () => (
  <WarningBox>
    Du har valgt utfall delvis medhold. Kabal vil opprette en Anke i Trygderetten-oppgave for den delen som går videre
    til Trygderetten. Dersom saken ikke skal videre til Trygderetten, velg utfall medhold.
  </WarningBox>
);

export const AnkeITRHenvistWarning = () => (
  <WarningBox>
    Du har valgt utfall <UtfallTag utfallId={UtfallEnum.HENVIST} />. Kabal vil opprette en ny ankeoppgave som du skal
    behandle. Vær oppmerksom på at du kun skal velge dette utfallet om saken skal tilbake til Trygderetten igjen. Skal
    du gjøre en ny vurdering i vedtak, må du velge utfall <UtfallTag utfallId={UtfallEnum.OPPHEVET} />.
  </WarningBox>
);

export const AnkeITROpphevetWarning = () => (
  <WarningBox>
    Du har valgt utfall <UtfallTag utfallId={UtfallEnum.OPPHEVET} />. Ved fullføring vil du få mulighet til å velge å
    opprette ny behandling i Kabal. Vær oppmerksom på at du kun skal velge utfall{' '}
    <UtfallTag utfallId={UtfallEnum.OPPHEVET} />
    dersom saken ikke skal tilbake til Trygderetten igjen, men du skal gjøre vurdering i vedtak. Dersom saken skal
    tilbake til Trygderetten igjen, velger du <UtfallTag utfallId={UtfallEnum.HENVIST} />.
  </WarningBox>
);
