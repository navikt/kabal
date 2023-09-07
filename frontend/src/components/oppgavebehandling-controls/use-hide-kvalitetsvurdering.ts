import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';

export const useHideKvalitetsvurdering = (): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { data: user, isLoading: userIsLoading } = useUser();

  if (oppgaveIsLoading || userIsLoading || oppgave === undefined || user === undefined) {
    return false;
  }

  const { typeId, resultat } = oppgave;

  if (typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return true;
  }

  return (
    oppgave.kvalitetsvurderingReference === null ||
    oppgave.rol.navIdent === user.navIdent ||
    resultat.utfallId === UtfallEnum.TRUKKET ||
    resultat.utfallId === UtfallEnum.RETUR ||
    resultat.utfallId === UtfallEnum.UGUNST ||
    oppgave?.feilregistrering !== null
  );
};
