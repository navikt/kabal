import { Annet } from '@app/components/kvalitetsvurdering/v1/annet';
import { BrukAvRaadgivendeLege } from '@app/components/kvalitetsvurdering/v1/bruk-av-raadgivende-lege';
import { Klageforberedelsen } from '@app/components/kvalitetsvurdering/v1/klageforberedelsen';
import { Utredningen } from '@app/components/kvalitetsvurdering/v1/utredningen';
import { Vedtaket } from '@app/components/kvalitetsvurdering/v1/vedtaket';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsRelevantYtelseForRaadgivende } from '@app/hooks/use-is-relevant-ytelse-for-raadgivende';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';

export const KvalitetsskjemaV1 = () => {
  const { data: oppgave } = useOppgave();
  const [kvalitetsvurdering] = useKvalitetsvurdering();

  if (typeof kvalitetsvurdering === 'undefined' || typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <>
      <Klageforberedelsen />
      <Utredningen />
      <BrukAvRaadgivendeLegeDisplay ytelse={oppgave.ytelseId} />
      <Vedtaket />
      <Annet />
    </>
  );
};

interface BrukAvRaadgivendeLegeDisplayProps {
  ytelse: string;
}

const BrukAvRaadgivendeLegeDisplay = ({ ytelse }: BrukAvRaadgivendeLegeDisplayProps) => {
  const hasRelevantYtelse = useIsRelevantYtelseForRaadgivende(ytelse);

  if (hasRelevantYtelse) {
    return <BrukAvRaadgivendeLege />;
  }

  return null;
};
