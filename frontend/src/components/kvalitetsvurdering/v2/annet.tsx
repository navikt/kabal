import { KvalitetsskjemaTextarea } from '@app/components/kvalitetsvurdering/v2/common/textarea';
import { KvalitetsvurderingInput } from '@app/components/kvalitetsvurdering/v2/common/types';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';

const HELPTEXT =
  'Det du skriver her er kun for klageinstansens interne bruk og blir ikke synlig for vedtaksinstansen. Har saken andre avvik som ikke passer med noen av de andre registreringsmulighetene i Kaka, kan du skrive dette her. Husk å skrive kort / med stikkord. Ikke skriv personopplysninger eller detaljer om saken. Du kan også skrive stikkord dersom saken gjelder et typetilfelle.';
const DESCRIPTION =
  'Det du skriver her er kun synlig for klageinstansen og ikke for vedtaksinstansen. Husk å ikke skrive personopplysninger.';

export const Annet = () => {
  const { isLoading } = useKvalitetsvurderingV2();

  if (isLoading) {
    return null;
  }

  return (
    <KvalitetsskjemaTextarea
      label="Annet (valgfri)"
      helpText={HELPTEXT}
      description={DESCRIPTION}
      field="annetFritekst"
      type={KvalitetsvurderingInput.TEXTAREA}
    />
  );
};
