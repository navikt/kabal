import { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';

export const useHideKvalitetsvurdering = (): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { user } = useContext(StaticDataContext);

  if (oppgaveIsLoading || oppgave === undefined) {
    return false;
  }

  const { typeId, resultat } = oppgave;

  if (typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN || typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET) {
    return true;
  }

  return (
    oppgave.kvalitetsvurderingReference === null ||
    oppgave.rol.employee?.navIdent === user.navIdent ||
    resultat.utfallId === UtfallEnum.TRUKKET ||
    resultat.utfallId === UtfallEnum.RETUR ||
    resultat.utfallId === UtfallEnum.UGUNST ||
    oppgave?.feilregistrering !== null
  );
};
