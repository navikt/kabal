import { formatPersonNum } from '../../../../functions/format-id';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useUser } from '../../../../simple-api-state/use-user';
import { Flettefelt } from '../../types/editor-void-types';

export const useFlettefeltValue = (flettefelt: Flettefelt | null): string | null => {
  const { data: oppgave } = useOppgave();
  const { data: bruker } = useUser();

  if (flettefelt === null || typeof oppgave === 'undefined' || typeof bruker === 'undefined') {
    return null;
  }

  switch (flettefelt) {
    case Flettefelt.FNR:
      return oppgave.sakenGjelder.person !== null
        ? formatPersonNum(oppgave.sakenGjelder.person.foedselsnummer)
        : '<Ikke funnet>';
    case Flettefelt.ENHET_NAME:
      return bruker.ansattEnhet.navn;
    default:
      return '<Ikke funnet>';
  }
};
