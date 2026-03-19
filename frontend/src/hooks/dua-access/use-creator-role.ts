import { useIsAssignedMedunderskriver } from '@/hooks/use-is-medunderskriver';
import { useIsAssignedRol } from '@/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { CreatorRole } from '@/types/documents/documents';

export const useCreatorRole = (): CreatorRole => {
  const isRol = useIsAssignedRol();
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const isMedunderskriver = useIsAssignedMedunderskriver();

  if (isRol) {
    return CreatorRole.KABAL_ROL;
  }

  if (isSaksbehandler) {
    return CreatorRole.KABAL_SAKSBEHANDLING;
  }

  if (isMedunderskriver) {
    return CreatorRole.KABAL_MEDUNDERSKRIVER;
  }

  return CreatorRole.NONE;
};
