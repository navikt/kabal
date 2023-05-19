import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { Flettefelt } from '../../types/editor-void-types';

export const useFlettefeltValue = (flettefelt: Flettefelt | null): string | null => {
  const { data: oppgave } = useOppgave();
  const { data: bruker } = useUser();

  if (flettefelt === null || typeof oppgave === 'undefined' || typeof bruker === 'undefined') {
    return null;
  }

  switch (flettefelt) {
    case Flettefelt.FNR:
      return formatFoedselsnummer(oppgave.sakenGjelder.id);
    case Flettefelt.ENHET_NAME:
      return bruker.ansattEnhet.navn;
    default:
      return '<Ikke funnet>';
  }
};
