import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsRelevantYtelseForRaadgivende } from '@app/hooks/use-is-relevant-ytelse-for-raadgivende';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';
import { Annet } from './annet';
import { BrukAvRaadgivendeLege } from './bruk-av-raadgivende-lege';
import { Klageforberedelsen } from './klageforberedelsen';
import { Utredningen } from './utredningen';
import { Vedtaket } from './vedtaket';

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
